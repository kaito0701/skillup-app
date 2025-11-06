import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Session-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ==================== HELPER FUNCTIONS ====================

// Simple password hashing (in production, use bcrypt)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Generate random session token
function generateToken(): string {
  return crypto.randomUUID();
}

// Generate user ID
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generate feedback ID
function generateFeedbackId(): string {
  return `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generate resource ID
function generateResourceId(): string {
  return `resource_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Verify session token from X-Session-Token header
async function verifySession(token: string | null) {
  if (!token) {
    console.log("No token provided for session verification");
    return null;
  }
  
  console.log(`Verifying session: session:${token.substring(0, 10)}...`);
  const session = await kv.get(`session:${token}`);
  if (session) {
    console.log("Session found:", session.email, session.is_admin ? "(admin)" : "(user)");
  } else {
    console.log("No session found for token");
  }
  return session;
}

// Call Gemini API
async function callGemini(prompt: string) {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("Gemini API key not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        }
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Gemini API error:", error);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  console.log("Gemini response:", JSON.stringify(data, null, 2));
  
  // Check if response has the expected structure
  if (!data.candidates || !data.candidates[0]) {
    console.error("Unexpected Gemini response structure - no candidates:", data);
    throw new Error("Invalid Gemini response structure - no candidates");
  }
  
  const candidate = data.candidates[0];
  
  // Check finish reason
  if (candidate.finishReason === "MAX_TOKENS") {
    console.error("Gemini response truncated due to MAX_TOKENS");
    throw new Error("Response truncated - prompt may be too long or response too complex");
  }
  
  if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
    console.error("Unexpected Gemini response structure - no content parts:", data);
    throw new Error("Invalid Gemini response structure - no content");
  }
  
  return candidate.content.parts[0].text;
}

// ==================== AUTH ROUTES ====================

// Sign up new user
app.post("/make-server-4192bdc4/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { fullName, email, password } = body;

    if (!fullName || !email || !password) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Check if user already exists
    const existingUsers = await kv.getByPrefix("user:");
    const userExists = existingUsers.some(
      (u: any) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (userExists) {
      return c.json({ error: "Email already registered" }, 400);
    }

    // Create new user
    const userId = generateUserId();
    const passwordHash = await hashPassword(password);
    const user = {
      id: userId,
      email: email.toLowerCase(),
      full_name: fullName,
      password_hash: passwordHash,
      created_at: new Date().toISOString(),
      level: 1,
      xp: 0,
      modules_completed: 0,
      is_admin: false,
    };

    await kv.set(`user:${userId}`, user);

    // Initialize user badges
    await kv.set(`badges:${userId}`, {
      user_id: userId,
      earned_badges: [],
    });

    // Create session
    const sessionToken = generateToken();
    const session = {
      token: sessionToken,
      user_id: userId,
      email: user.email,
      full_name: user.full_name,
      is_admin: false,
      created_at: new Date().toISOString(),
    };
    await kv.set(`session:${sessionToken}`, session);

    return c.json({
      success: true,
      session_token: sessionToken,
      user: {
        id: userId,
        email: user.email,
        full_name: user.full_name,
        level: user.level,
        xp: user.xp,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ error: "Failed to create account" }, 500);
  }
});

// User login
app.post("/make-server-4192bdc4/auth/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: "Missing email or password" }, 400);
    }

    // Find user
    const users = await kv.getByPrefix("user:");
    const user = users.find(
      (u: any) =>
        u.email.toLowerCase() === email.toLowerCase() && !u.is_admin
    );

    if (!user) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    // Verify password
    const passwordHash = await hashPassword(password);
    if (user.password_hash !== passwordHash) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    // Create session
    const sessionToken = generateToken();
    const session = {
      token: sessionToken,
      user_id: user.id,
      email: user.email,
      full_name: user.full_name,
      is_admin: false,
      created_at: new Date().toISOString(),
    };
    await kv.set(`session:${sessionToken}`, session);

    return c.json({
      success: true,
      session_token: sessionToken,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        level: user.level,
        xp: user.xp,
        modules_completed: user.modules_completed,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Failed to login" }, 500);
  }
});

// Admin login
app.post("/make-server-4192bdc4/auth/admin-login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: "Missing email or password" }, 400);
    }

    // Find admin user
    const users = await kv.getByPrefix("user:");
    const admin = users.find(
      (u: any) =>
        u.email.toLowerCase() === email.toLowerCase() && u.is_admin === true
    );

    if (!admin) {
      return c.json({ error: "Invalid admin credentials" }, 401);
    }

    // Verify password
    const passwordHash = await hashPassword(password);
    if (admin.password_hash !== passwordHash) {
      return c.json({ error: "Invalid admin credentials" }, 401);
    }

    // Create admin session
    const sessionToken = generateToken();
    const session = {
      token: sessionToken,
      user_id: admin.id,
      email: admin.email,
      full_name: admin.full_name,
      is_admin: true,
      created_at: new Date().toISOString(),
    };
    await kv.set(`session:${sessionToken}`, session);

    return c.json({
      success: true,
      session_token: sessionToken,
      admin: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return c.json({ error: "Failed to login" }, 500);
  }
});

// Verify session
app.get("/make-server-4192bdc4/auth/session", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    const session = await verifySession(token || null);

    if (!session) {
      console.log("No valid session found for verification request");
      return c.json({ success: false, session: null }, 200);
    }

    return c.json({ success: true, session });
  } catch (error) {
    console.error("Session verification error:", error);
    return c.json({ error: "Failed to verify session" }, 500);
  }
});

// Logout
app.post("/make-server-4192bdc4/auth/logout", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");

    if (token) {
      try {
        await kv.del(`session:${token}`);
        console.log(`Session deleted: session:${token}`);
      } catch (delError) {
        console.error("Error deleting session:", delError);
        // Continue anyway - session might not exist
      }
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    // Still return success since we want to clear the token on frontend
    return c.json({ success: true });
  }
});

// ==================== USER ROUTES ====================

// Get user profile
app.get("/make-server-4192bdc4/user/profile", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    console.log("Profile request - token present:", !!token);
    
    const session = await verifySession(token || null);

    if (!session) {
      console.log("Profile request - no valid session found");
      return c.json({ error: "Unauthorized" }, 401);
    }

    console.log("Profile request - loading user with ID:", session.user_id);
    const userKey = `user:${session.user_id}`;
    console.log("Looking up user with key:", userKey);
    let user = await kv.get(userKey);
    
    if (!user) {
      console.log(`User not found at key: ${userKey}, trying fallback search`);
      
      // Fallback: search all users by ID (in case of database inconsistency)
      const allUsers = await kv.getByPrefix("user:");
      console.log(`Found ${allUsers.length} total users in database`);
      
      user = allUsers.find((u: any) => u.id === session.user_id);
      
      if (!user) {
        console.log(`User ${session.user_id} not found in any user records`);
        console.log("Session data:", JSON.stringify(session));
        
        // Check if this might be an old session with email as user_id
        user = allUsers.find((u: any) => u.email === session.email);
        
        if (user) {
          console.log(`Found user by email match (${session.email}), fixing session...`);
          // Update the session with correct user_id
          const updatedSession = { ...session, user_id: user.id };
          await kv.set(`session:${session.token || c.req.header("X-Session-Token")}`, updatedSession);
        } else {
          return c.json({ error: "User not found" }, 404);
        }
      } else {
        console.log(`Found user ${user.id} via fallback search, database may need cleanup`);
      }
    }

    // Get user badges
    const badgesData = await kv.get(`badges:${session.user_id}`);
    const badges = badgesData?.earned_badges || [];

    // Get completed modules
    const allProgress = await kv.getByPrefix(`progress:${session.user_id}:`);
    const completedModules = allProgress
      .filter((p: any) => p.completed)
      .map((p: any) => ({
        module_id: p.module_id,
        module_name: p.module_name || p.module_id,
        completed_at: p.completed_at,
      }));

    return c.json({
      success: true,
      profile: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        level: user.level,
        xp: user.xp,
        modules_completed: user.modules_completed,
        badges: badges,
        completed_modules: completedModules,
      },
    });
  } catch (error: any) {
    console.error("Get profile error:", error);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    return c.json({ 
      error: "Failed to get profile",
      details: error?.message 
    }, 500);
  }
});

// Update user profile
app.put("/make-server-4192bdc4/user/profile", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    const session = await verifySession(token || null);

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { full_name, email, current_password, new_password } = body;

    const user = await kv.get(`user:${session.user_id}`);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    // If changing password, verify current password
    if (new_password) {
      if (!current_password) {
        return c.json({ error: "Current password required" }, 400);
      }
      const currentHash = await hashPassword(current_password);
      if (user.password_hash !== currentHash) {
        return c.json({ error: "Current password is incorrect" }, 401);
      }
      user.password_hash = await hashPassword(new_password);
    }

    // Update fields
    if (full_name) user.full_name = full_name;
    if (email) {
      // Check if email is already taken
      const allUsers = await kv.getByPrefix("user:");
      const emailTaken = allUsers.some(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.id !== user.id
      );
      if (emailTaken) {
        return c.json({ error: "Email already in use" }, 400);
      }
      user.email = email.toLowerCase();
    }

    user.updated_at = new Date().toISOString();
    await kv.set(`user:${session.user_id}`, user);

    // Update session if email or name changed
    if (email || full_name) {
      session.email = user.email;
      session.full_name = user.full_name;
      await kv.set(`session:${token}`, session);
    }

    return c.json({
      success: true,
      profile: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        level: user.level,
        xp: user.xp,
        modules_completed: user.modules_completed,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

// Update module progress
app.post("/make-server-4192bdc4/user/progress", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    const session = await verifySession(token || null);

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { moduleId, completed, progressPercentage, moduleName } = body;

    if (!moduleId) {
      return c.json({ error: "Missing moduleId" }, 400);
    }

    // Save progress
    const progressKey = `progress:${session.user_id}:${moduleId}`;
    const existingProgress = await kv.get(progressKey);
    const wasCompleted = existingProgress?.completed || false;

    // If already completed, keep it completed
    const isCompleted = wasCompleted || completed || false;
    
    // Update progress percentage (keep existing if higher)
    const currentProgress = Math.max(
      existingProgress?.progress_percentage || 0,
      progressPercentage || 0
    );

    const progress = {
      user_id: session.user_id,
      module_id: moduleId,
      module_name: moduleName || existingProgress?.module_name || moduleId,
      completed: isCompleted,
      completed_at: completed && !wasCompleted ? new Date().toISOString() : existingProgress?.completed_at,
      progress_percentage: isCompleted ? 100 : currentProgress,
      updated_at: new Date().toISOString(),
      last_accessed: new Date().toISOString(),
    };

    await kv.set(progressKey, progress);
    
    // Update user's last accessed module (for "Continue Learning" section)
    // Only show in "Continue Learning" if not completed
    const user = await kv.get(`user:${session.user_id}`);
    if (user) {
      user.last_accessed_module = {
        module_id: moduleId,
        module_name: moduleName || existingProgress?.module_name || moduleId,
        progress_percentage: isCompleted ? 100 : currentProgress,
        completed: isCompleted,
        accessed_at: new Date().toISOString(),
      };
      await kv.set(`user:${session.user_id}`, user);
    }

    // Update user stats if module was just completed
    if (completed && !wasCompleted) {
      const user = await kv.get(`user:${session.user_id}`);
      if (user) {
        user.modules_completed = (user.modules_completed || 0) + 1;
        user.xp = (user.xp || 0) + 50; // Award 50 XP per completed module
        
        // Level up every 100 XP
        user.level = Math.floor(user.xp / 100) + 1;
        
        await kv.set(`user:${session.user_id}`, user);

        // Check and award badges
        await checkAndAwardBadges(session.user_id, user);
      }
    }

    return c.json({ success: true, progress });
  } catch (error) {
    console.error("Update progress error:", error);
    return c.json({ error: "Failed to update progress" }, 500);
  }
});

// Check and award badges
async function checkAndAwardBadges(userId: string, user: any) {
  const badgesData = await kv.get(`badges:${userId}`);
  const earnedBadges = badgesData?.earned_badges || [];
  let updated = false;

  // First Steps badge - complete 1 module
  if (user.modules_completed >= 1 && !earnedBadges.includes("first-steps")) {
    earnedBadges.push("first-steps");
    updated = true;
  }

  // Quick Learner - complete 3 modules
  if (user.modules_completed >= 3 && !earnedBadges.includes("quick-learner")) {
    earnedBadges.push("quick-learner");
    updated = true;
  }

  // Top Scorer - complete 5 modules
  if (user.modules_completed >= 5 && !earnedBadges.includes("top-scorer")) {
    earnedBadges.push("top-scorer");
    updated = true;
  }

  // Expert - complete 10 modules
  if (user.modules_completed >= 10 && !earnedBadges.includes("expert")) {
    earnedBadges.push("expert");
    updated = true;
  }

  // Master - complete 15 modules
  if (user.modules_completed >= 15 && !earnedBadges.includes("master")) {
    earnedBadges.push("master");
    updated = true;
  }

  if (updated) {
    await kv.set(`badges:${userId}`, {
      user_id: userId,
      earned_badges: earnedBadges,
    });
  }
}

// Get all modules with user progress
app.get("/make-server-4192bdc4/user/modules", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    console.log("GET /user/modules - X-Session-Token header received:", !!token);
    if (token) {
      console.log("Token preview:", token.substring(0, 15) + "...");
    }
    
    const session = await verifySession(token || null);

    if (!session) {
      console.log("GET /user/modules - Session verification failed, returning Unauthorized");
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    console.log("GET /user/modules - Session verified for user:", session.email);

    // Get all user progress
    const allProgress = await kv.getByPrefix(`progress:${session.user_id}:`);
    const progressMap: any = {};
    
    allProgress.forEach((p: any) => {
      progressMap[p.module_id] = p;
    });

    return c.json({
      success: true,
      progress: progressMap,
    });
  } catch (error) {
    console.error("Get modules error:", error);
    return c.json({ error: "Failed to get modules" }, 500);
  }
});

// ==================== AI/GEMINI ROUTES ====================

// Generate career assessment with Gemini
app.post("/make-server-4192bdc4/ai/generate-assessment", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    const session = await verifySession(token || null);

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const prompt = `Generate a career assessment quiz with 8 questions in ENGLISH for Filipino students and job seekers. 
    Each question should have 4 options (A, B, C, D). Keep options concise (max 15 words each).
    Assess interests, skills, values, and personality traits for career planning.
    IMPORTANT: Write all content in English language.
    Return ONLY a JSON array, no markdown or extra text:
    [
      {
        "id": 1,
        "question": "Brief question text",
        "options": {
          "A": "Concise option A",
          "B": "Concise option B",
          "C": "Concise option C",
          "D": "Concise option D"
        }
      }
    ]`;

    const response = await callGemini(prompt);
    console.log("Raw Gemini response for assessment:", response);
    
    // Extract JSON from response - handle code blocks and plain JSON
    let jsonText = response;
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Try to find JSON array
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("Could not find JSON array in response:", response);
      throw new Error("Invalid response format from Gemini - no JSON array found");
    }
    
    const questions = JSON.parse(jsonMatch[0]);

    return c.json({
      success: true,
      questions: questions,
    });
  } catch (error: any) {
    console.error("Generate assessment error:", error);
    return c.json({ 
      error: "Failed to generate assessment",
      details: error?.message 
    }, 500);
  }
});

// Analyze career assessment results with Gemini
app.post("/make-server-4192bdc4/ai/analyze-assessment", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    const session = await verifySession(token || null);

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { responses } = body;

    if (!responses || !Array.isArray(responses)) {
      return c.json({ error: "Invalid responses" }, 400);
    }

    const prompt = `Analyze these career assessment responses: ${JSON.stringify(responses)}
    
    Based on the responses, provide in ENGLISH:
    1. Top 3 career paths (title, brief description, match %)
    2. 3 key strengths
    3. 2 development areas
    4. 3 learning recommendations
    
    IMPORTANT: Write all content in English language.
    Return ONLY JSON, no markdown:
    {
      "career_paths": [
        {"title": "Career", "description": "Brief fit (max 30 words)", "match_percentage": 90}
      ],
      "strengths": ["strength 1", "strength 2", "strength 3"],
      "development_areas": ["area 1", "area 2"],
      "learning_recommendations": ["rec 1", "rec 2", "rec 3"]
    }`;

    const response = await callGemini(prompt);
    console.log("Raw Gemini response for analysis:", response);
    
    // Extract JSON from response - handle code blocks and plain JSON
    let jsonText = response;
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Try to find JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Could not find JSON object in response:", response);
      throw new Error("Invalid response format from Gemini - no JSON object found");
    }
    
    const analysis = JSON.parse(jsonMatch[0]);

    // Save assessment results
    const assessment = {
      user_id: session.user_id,
      responses: responses,
      analysis: analysis,
      completed_at: new Date().toISOString(),
    };

    await kv.set(`assessment:${session.user_id}`, assessment);

    return c.json({
      success: true,
      analysis: analysis,
    });
  } catch (error: any) {
    console.error("Analyze assessment error:", error);
    return c.json({ 
      error: "Failed to analyze assessment",
      details: error?.message 
    }, 500);
  }
});

// Get assessment results
app.get("/make-server-4192bdc4/assessment/results", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    const session = await verifySession(token || null);

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const assessment = await kv.get(`assessment:${session.user_id}`);

    if (!assessment) {
      return c.json({ success: true, assessment: null });
    }

    return c.json({ success: true, assessment });
  } catch (error) {
    console.error("Get assessment error:", error);
    return c.json({ error: "Failed to get assessment" }, 500);
  }
});

// Generate personalized learning modules with Gemini
app.post("/make-server-4192bdc4/ai/generate-modules", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    const session = await verifySession(token || null);

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { careerPath, hasAssessment } = body;

    let prompt;
    if (hasAssessment && careerPath) {
      prompt = `Generate 6 personalized microlearning modules in ENGLISH for a Filipino student pursuing a career in ${careerPath}.
      Each module should be practical, relevant to the Philippine job market, and include specific skills.`;
    } else {
      prompt = `Generate 6 general useful microlearning modules in ENGLISH for Filipino students and job seekers.
      Focus on universal career skills like communication, digital literacy, problem-solving, etc.`;
    }

    prompt += `\n\nIMPORTANT: Write all content in English language.
    Return ONLY a JSON array, no markdown:
    [
      {
        "id": "module-1",
        "title": "Module Title",
        "description": "Brief description (max 20 words)",
        "category": "Category",
        "duration": "15 min",
        "level": "Beginner",
        "icon": "BookOpen"
      }
    ]`;

    const response = await callGemini(prompt);
    console.log("Raw Gemini response for modules:", response);
    
    // Extract JSON from response - handle code blocks and plain JSON
    let jsonText = response;
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Try to find JSON array
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("Could not find JSON array in response:", response);
      throw new Error("Invalid response format from Gemini - no JSON array found");
    }
    
    const modules = JSON.parse(jsonMatch[0]);

    return c.json({
      success: true,
      modules: modules,
    });
  } catch (error: any) {
    console.error("Generate modules error:", error);
    return c.json({ 
      error: "Failed to generate modules",
      details: error?.message 
    }, 500);
  }
});

// Generate lesson content with Gemini
app.post("/make-server-4192bdc4/ai/generate-lesson", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    const session = await verifySession(token || null);

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { moduleTitle, moduleDescription } = body;

    if (!moduleTitle) {
      return c.json({ error: "Module title required" }, 400);
    }

    const prompt = `Create a comprehensive microlearning lesson for Filipino learners on "${moduleTitle}".
    ${moduleDescription ? `Context: ${moduleDescription}` : ''}
    
    Include:
    1. Clear learning objectives in English (3 points)
    2. Main content broken into 3-4 sections with headings and concise explanations in English
    3. 2 practical examples relevant to Filipino context (in English)
    4. Key takeaways in English (3 points)
    5. A quiz with 3 multiple choice questions in English to test understanding
    
    IMPORTANT: Write ALL content in English language, not Filipino/Tagalog.
    
    Format as JSON:
    {
      "objectives": ["objective 1", "objective 2", "objective 3"],
      "sections": [
        {
          "heading": "Section Title",
          "content": "Detailed explanation text"
        }
      ],
      "examples": ["example 1", "example 2"],
      "key_takeaways": ["takeaway 1", "takeaway 2", "takeaway 3"],
      "quiz": [
        {
          "question": "Question text",
          "options": ["A) option 1", "B) option 2", "C) option 3", "D) option 4"],
          "correct_answer": "A",
          "explanation": "Why this is correct"
        }
      ]
    }
    
    Only return the JSON, no additional text.`;

    const response = await callGemini(prompt);
    console.log("Raw Gemini response for lesson:", response);
    
    // Extract JSON from response - handle code blocks and plain JSON
    let jsonText = response;
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Try to find JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Could not find JSON object in response:", response);
      throw new Error("Invalid response format from Gemini - no JSON object found");
    }
    
    const lesson = JSON.parse(jsonMatch[0]);

    return c.json({
      success: true,
      lesson: lesson,
    });
  } catch (error: any) {
    console.error("Generate lesson error:", error);
    return c.json({ 
      error: "Failed to generate lesson",
      details: error?.message 
    }, 500);
  }
});

// ==================== FEEDBACK ROUTES ====================

// Submit feedback
app.post("/make-server-4192bdc4/feedback/submit", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    const session = await verifySession(token || null);

    const body = await c.req.json();
    const { message, category } = body;

    if (!message) {
      return c.json({ error: "Message is required" }, 400);
    }

    const feedbackId = generateFeedbackId();
    const feedback = {
      id: feedbackId,
      user_id: session?.user_id || null,
      user_name: session?.full_name || "Anonymous",
      user_email: session?.email || "No email provided",
      message: message,
      category: category || "general",
      timestamp: new Date().toISOString(),
      status: "unread",
    };

    await kv.set(`feedback:${feedbackId}`, feedback);

    return c.json({ success: true, feedback });
  } catch (error) {
    console.error("Submit feedback error:", error);
    return c.json({ error: "Failed to submit feedback" }, 500);
  }
});

// Get all feedback (admin only)
app.get("/make-server-4192bdc4/feedback/all", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    const session = await verifySession(token || null);

    if (!session || !session.is_admin) {
      return c.json({ error: "Unauthorized - Admin only" }, 403);
    }

    const allFeedback = await kv.getByPrefix("feedback:");
    
    // Sort by timestamp (newest first)
    allFeedback.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return c.json({ success: true, feedback: allFeedback });
  } catch (error) {
    console.error("Get feedback error:", error);
    return c.json({ error: "Failed to get feedback" }, 500);
  }
});

// Update feedback status (admin only)
app.put("/make-server-4192bdc4/feedback/:id", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    const session = await verifySession(token || null);

    if (!session || !session.is_admin) {
      return c.json({ error: "Unauthorized - Admin only" }, 403);
    }

    const feedbackId = c.req.param("id");
    const body = await c.req.json();
    const { status } = body;

    const feedback = await kv.get(`feedback:${feedbackId}`);
    if (!feedback) {
      return c.json({ error: "Feedback not found" }, 404);
    }

    feedback.status = status;
    feedback.updated_at = new Date().toISOString();
    
    await kv.set(`feedback:${feedbackId}`, feedback);

    return c.json({ success: true, feedback });
  } catch (error) {
    console.error("Update feedback error:", error);
    return c.json({ error: "Failed to update feedback" }, 500);
  }
});

// ==================== COMMUNITY RESOURCES ROUTES ====================

// Get all resources
app.get("/make-server-4192bdc4/resources", async (c) => {
  try {
    const allResources = await kv.getByPrefix("resource:");
    
    // Sort by created date
    allResources.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return c.json({ success: true, resources: allResources });
  } catch (error) {
    console.error("Get resources error:", error);
    return c.json({ error: "Failed to get resources" }, 500);
  }
});

// Add new resource (admin only)
app.post("/make-server-4192bdc4/resources", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    const session = await verifySession(token || null);

    if (!session || !session.is_admin) {
      return c.json({ error: "Unauthorized - Admin only" }, 403);
    }

    const body = await c.req.json();
    const { name, type, address, contact, latitude, longitude } = body;

    if (!name || !type) {
      return c.json({ error: "Name and type are required" }, 400);
    }

    const resourceId = generateResourceId();
    const resource = {
      id: resourceId,
      name,
      type,
      address: address || "",
      contact: contact || "",
      latitude: latitude || 14.5995,
      longitude: longitude || 120.9842,
      created_at: new Date().toISOString(),
    };

    await kv.set(`resource:${resourceId}`, resource);

    return c.json({ success: true, resource });
  } catch (error) {
    console.error("Add resource error:", error);
    return c.json({ error: "Failed to add resource" }, 500);
  }
});

// Update resource (admin only)
app.put("/make-server-4192bdc4/resources/:id", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    const session = await verifySession(token || null);

    if (!session || !session.is_admin) {
      return c.json({ error: "Unauthorized - Admin only" }, 403);
    }

    const resourceId = c.req.param("id");
    const body = await c.req.json();

    const resource = await kv.get(`resource:${resourceId}`);
    if (!resource) {
      return c.json({ error: "Resource not found" }, 404);
    }

    // Update fields
    if (body.name !== undefined) resource.name = body.name;
    if (body.type !== undefined) resource.type = body.type;
    if (body.address !== undefined) resource.address = body.address;
    if (body.contact !== undefined) resource.contact = body.contact;
    if (body.latitude !== undefined) resource.latitude = body.latitude;
    if (body.longitude !== undefined) resource.longitude = body.longitude;
    
    resource.updated_at = new Date().toISOString();
    
    await kv.set(`resource:${resourceId}`, resource);

    return c.json({ success: true, resource });
  } catch (error) {
    console.error("Update resource error:", error);
    return c.json({ error: "Failed to update resource" }, 500);
  }
});

// Delete resource (admin only)
app.delete("/make-server-4192bdc4/resources/:id", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    const session = await verifySession(token || null);

    if (!session || !session.is_admin) {
      return c.json({ error: "Unauthorized - Admin only" }, 403);
    }

    const resourceId = c.req.param("id");

    const resource = await kv.get(`resource:${resourceId}`);
    if (!resource) {
      return c.json({ error: "Resource not found" }, 404);
    }

    await kv.del(`resource:${resourceId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error("Delete resource error:", error);
    return c.json({ error: "Failed to delete resource" }, 500);
  }
});

// ==================== ADMIN ROUTES ====================

// Get dashboard statistics (admin only)
app.get("/make-server-4192bdc4/admin/stats", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    const session = await verifySession(token || null);

    if (!session || !session.is_admin) {
      return c.json({ error: "Unauthorized - Admin only" }, 403);
    }

    // Get all users
    const allUsers = await kv.getByPrefix("user:");
    const regularUsers = allUsers.filter((u: any) => !u.is_admin);
    
    // Calculate active users (logged in within last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const allSessions = await kv.getByPrefix("session:");
    const activeSessions = allSessions.filter((s: any) => 
      !s.is_admin && new Date(s.created_at) > sevenDaysAgo
    );
    const activeUsers = new Set(activeSessions.map((s: any) => s.user_id)).size;

    // Calculate total modules completed
    const allProgress = await kv.getByPrefix("progress:");
    const completedModules = allProgress.filter((p: any) => p.completed).length;

    // Calculate average completion rate
    const totalProgress = allProgress.length;
    const avgCompletion = totalProgress > 0 
      ? (completedModules / totalProgress) * 100 
      : 0;

    // Calculate new signups this week
    const newSignups = regularUsers.filter((u: any) => 
      new Date(u.created_at) > sevenDaysAgo
    ).length;

    return c.json({
      success: true,
      stats: {
        total_users: regularUsers.length,
        active_users: activeUsers,
        modules_completed: completedModules,
        avg_completion: avgCompletion.toFixed(1),
        new_signups: newSignups,
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    return c.json({ error: "Failed to get statistics" }, 500);
  }
});

// Get all users (admin only)
app.get("/make-server-4192bdc4/admin/users", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    const session = await verifySession(token || null);

    if (!session || !session.is_admin) {
      return c.json({ error: "Unauthorized - Admin only" }, 403);
    }

    const allUsers = await kv.getByPrefix("user:");
    const regularUsers = allUsers.filter((u: any) => !u.is_admin);

    // Sort by registration date (newest first)
    regularUsers.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Remove password hashes from response
    const sanitizedUsers = regularUsers.map((u: any) => {
      const { password_hash, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });

    return c.json({ success: true, users: sanitizedUsers });
  } catch (error) {
    console.error("Get users error:", error);
    return c.json({ error: "Failed to get users" }, 500);
  }
});

// Update user (admin only)
app.put("/make-server-4192bdc4/admin/users/:userId", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    const session = await verifySession(token || null);

    if (!session || !session.is_admin) {
      console.log("Update user - unauthorized attempt");
      return c.json({ error: "Unauthorized - Admin only" }, 403);
    }

    const userId = c.req.param("userId");
    const body = await c.req.json();
    const { email, full_name, password } = body;

    console.log(`Updating user ${userId}:`, { email, full_name, hasPassword: !!password });

    // Get user by ID
    const allUsers = await kv.getByPrefix("user:");
    console.log(`Found ${allUsers.length} total users`);
    const user = allUsers.find((u: any) => u.id === userId);

    if (!user) {
      console.log(`User ${userId} not found`);
      return c.json({ error: "User not found" }, 404);
    }
    
    console.log(`Found user:`, user.email);

    // Update user data
    const updatedUser: any = {
      ...user,
      email: email || user.email,
      full_name: full_name || user.full_name,
      updated_at: new Date().toISOString(),
    };

    // Update password if provided
    if (password && password.trim()) {
      updatedUser.password_hash = await hashPassword(password);
    }

    // Save updated user (key is user:userId, not user:email)
    await kv.set(`user:${userId}`, updatedUser);
    console.log(`Successfully updated user ${userId} at key user:${userId}`);

    return c.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update user error:", error);
    return c.json({ error: "Failed to update user" }, 500);
  }
});

// Delete user (admin only)
app.delete("/make-server-4192bdc4/admin/users/:userId", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    const session = await verifySession(token || null);

    if (!session || !session.is_admin) {
      console.log("Delete user - unauthorized attempt");
      return c.json({ error: "Unauthorized - Admin only" }, 403);
    }

    const userId = c.req.param("userId");
    console.log(`Deleting user ${userId}`);

    // Get user by ID
    const allUsers = await kv.getByPrefix("user:");
    console.log(`Found ${allUsers.length} total users for deletion`);
    const user = allUsers.find((u: any) => u.id === userId);

    if (!user) {
      console.log(`User ${userId} not found for deletion`);
      return c.json({ error: "User not found" }, 404);
    }

    console.log(`Deleting user:`, user.email, `with userId:`, userId);
    
    // Delete user (key is user:userId, not user:email)
    await kv.del(`user:${userId}`);
    console.log(`Deleted user key: user:${userId}`);

    // Delete user's sessions
    const allSessions = await kv.getByPrefix("session:");
    const userSessions = allSessions.filter((s: any) => s.user_id === userId);
    console.log(`Found ${userSessions.length} sessions for user ${userId}`);
    for (const session of userSessions) {
      if (session.token) {
        await kv.del(`session:${session.token}`);
        console.log(`Deleted session: session:${session.token}`);
      } else {
        console.log(`Session without token found (old session):`, session);
      }
    }

    // Delete user's progress
    const progressKeys = await kv.getByPrefix(`progress:${userId}:`);
    console.log(`Found ${progressKeys.length} progress records for user ${userId}`);
    for (const progress of progressKeys) {
      // The key is stored in the data itself
      const progressKey = `progress:${userId}:${progress.module_id || ''}`;
      try {
        await kv.del(progressKey);
        console.log(`Deleted progress: ${progressKey}`);
      } catch (e) {
        console.error(`Failed to delete progress key ${progressKey}:`, e);
      }
    }

    // Delete user's assessment
    await kv.del(`assessment:${userId}`);
    console.log(`Deleted assessment for user ${userId}`);

    // Delete user's badges
    await kv.del(`badges:${userId}`);
    console.log(`Deleted badges for user ${userId}`);

    console.log(`Successfully deleted user ${userId} and all associated data`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return c.json({ error: "Failed to delete user" }, 500);
  }
});

// Get analytics data (admin only)
app.get("/make-server-4192bdc4/admin/analytics", async (c) => {
  try {
    const token = c.req.header("X-Session-Token");
    const session = await verifySession(token || null);

    if (!session || !session.is_admin) {
      return c.json({ error: "Unauthorized - Admin only" }, 403);
    }

    // Get engagement data for last 7 days
    const today = new Date();
    const engagementData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStart = new Date(date.setHours(0, 0, 0, 0));
      const dateEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const allSessions = await kv.getByPrefix("session:");
      const dailySessions = allSessions.filter((s: any) => {
        const sessionDate = new Date(s.created_at);
        return sessionDate >= dateStart && sessionDate <= dateEnd && !s.is_admin;
      });
      
      const uniqueUsers = new Set(dailySessions.map((s: any) => s.user_id)).size;
      
      engagementData.push({
        date: dateStart.toISOString().split('T')[0],
        users: uniqueUsers,
      });
    }

    // Get module completion stats
    const allProgress = await kv.getByPrefix("progress:");
    const moduleStats: any = {};
    let totalCompleted = 0;
    let totalInProgress = 0;
    let totalAbandoned = 0;
    
    allProgress.forEach((p: any) => {
      const moduleName = p.module_name || p.module_id || "Unknown Module";
      if (!moduleStats[moduleName]) {
        moduleStats[moduleName] = { started: 0, completed: 0 };
      }
      moduleStats[moduleName].started++;
      if (p.completed) {
        moduleStats[moduleName].completed++;
        totalCompleted++;
      } else if (p.progress && p.progress > 0) {
        totalInProgress++;
      } else {
        totalAbandoned++;
      }
    });

    // Convert to array for frontend, get top modules
    const modulePopularity = Object.entries(moduleStats)
      .map(([name, stats]: [string, any]) => ({
        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
        completions: stats.completed,
      }))
      .sort((a, b) => b.completions - a.completions)
      .slice(0, 5);

    // Calculate completion rate
    const totalModules = allProgress.length;
    const completionRate = totalModules > 0 ? (totalCompleted / totalModules) * 100 : 0;

    // Calculate average time (mock for now, would need actual time tracking)
    const avgTime = 43;

    // Calculate drop-off data
    const total = totalCompleted + totalInProgress + totalAbandoned;
    const dropOffData = [
      { name: "Completed", value: total > 0 ? Math.round((totalCompleted / total) * 100) : 0, color: "#10b981" },
      { name: "In Progress", value: total > 0 ? Math.round((totalInProgress / total) * 100) : 0, color: "#f59e0b" },
      { name: "Abandoned", value: total > 0 ? Math.round((totalAbandoned / total) * 100) : 0, color: "#ef4444" },
    ];

    return c.json({
      success: true,
      analytics: {
        engagement: engagementData,
        module_stats: moduleStats,
        module_popularity: modulePopularity,
        completion_rate: completionRate.toFixed(1),
        avg_time: avgTime,
        drop_off_data: dropOffData,
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    return c.json({ error: "Failed to get analytics" }, 500);
  }
});

// ==================== SEED DATA ROUTE ====================

// Create default admin account (for initial setup)
app.post("/make-server-4192bdc4/seed/admin", async (c) => {
  try {
    // Check if admin already exists
    const users = await kv.getByPrefix("user:");
    const adminExists = users.some((u: any) => u.is_admin);

    if (adminExists) {
      return c.json({ message: "Admin already exists" }, 400);
    }

    // Create default admin
    const adminId = generateUserId();
    const passwordHash = await hashPassword("admin123"); // Default password
    const admin = {
      id: adminId,
      email: "admin@skillup.com",
      full_name: "Admin User",
      password_hash: passwordHash,
      created_at: new Date().toISOString(),
      level: 1,
      xp: 0,
      modules_completed: 0,
      is_admin: true,
    };

    await kv.set(`user:${adminId}`, admin);

    return c.json({
      success: true,
      message: "Admin account created",
      credentials: {
        email: "admin@skillup.com",
        password: "admin123",
      },
    });
  } catch (error) {
    console.error("Seed admin error:", error);
    return c.json({ error: "Failed to create admin" }, 500);
  }
});

// Health check endpoint
app.get("/make-server-4192bdc4/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);
