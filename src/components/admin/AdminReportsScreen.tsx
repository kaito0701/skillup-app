import { ArrowLeft, Download, FileText, Calendar, Filter } from "lucide-react";
import { AnimatedCard } from "../AnimatedCard";
import { AnimatedButton } from "../AnimatedButton";
import { motion } from "motion/react";

interface AdminReportsScreenProps {
  onNavigate: (screen: string) => void;
}

const reportTypes = [
  {
    id: 1,
    title: "User Activity Report",
    description: "Detailed breakdown of user engagement and activity",
    icon: "📊",
    lastGenerated: "Nov 1, 2024",
    format: ["CSV", "PDF"],
  },
  {
    id: 2,
    title: "Learning Progress Report",
    description: "Module completion rates and learning outcomes",
    icon: "📈",
    lastGenerated: "Nov 1, 2024",
    format: ["CSV", "PDF"],
  },
  {
    id: 3,
    title: "Assessment Results",
    description: "Career assessment quiz results and trends",
    icon: "✅",
    lastGenerated: "Oct 30, 2024",
    format: ["CSV", "PDF", "Excel"],
  },
  {
    id: 4,
    title: "SDG Impact Report",
    description: "Alignment with UN Sustainable Development Goals",
    icon: "🌍",
    lastGenerated: "Oct 28, 2024",
    format: ["PDF"],
  },
  {
    id: 5,
    title: "Resource Usage Report",
    description: "Community resources views and engagement",
    icon: "📍",
    lastGenerated: "Oct 25, 2024",
    format: ["CSV", "PDF"],
  },
  {
    id: 6,
    title: "Feedback Summary",
    description: "User feedback trends and sentiment analysis",
    icon: "💬",
    lastGenerated: "Nov 2, 2024",
    format: ["PDF"],
  },
];

export function AdminReportsScreen({ onNavigate }: AdminReportsScreenProps) {
  const handleExport = (reportTitle: string, format: string) => {
    alert(`Exporting "${reportTitle}" as ${format}...`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 pt-8 pb-20 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => onNavigate("admin-dashboard")}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white text-2xl">Reports & Export</h1>
            <p className="text-orange-100">Generate and download reports</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-white" />
              <p className="text-white/80 text-sm">Available</p>
            </div>
            <h3 className="text-white">{reportTypes.length} Reports</h3>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-white" />
              <p className="text-white/80 text-sm">Last Updated</p>
            </div>
            <h3 className="text-white">Nov 2, 2024</h3>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-12 pb-24">
        {/* Date Filter */}
        <AnimatedCard className="p-4 mb-6">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-gray-600 text-sm mb-1">Date Range</p>
              <p className="text-gray-900">Last 30 days</p>
            </div>
            <AnimatedButton
              onClick={() => alert("Filter date range functionality")}
              className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 px-4 py-2 rounded-xl h-auto"
            >
              Change
            </AnimatedButton>
          </div>
        </AnimatedCard>

        {/* Report List */}
        <h3 className="text-gray-900 mb-4">Available Reports</h3>
        <div className="space-y-3">
          {reportTypes.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <AnimatedCard className="p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-3xl">{report.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{report.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{report.description}</p>
                    <p className="text-gray-500 text-xs">
                      Last generated: {report.lastGenerated}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-gray-600 text-sm mb-3">Export as:</p>
                  <div className="flex gap-2 flex-wrap">
                    {report.format.map((format) => (
                      <AnimatedButton
                        key={format}
                        onClick={() => handleExport(report.title, format)}
                        className="bg-orange-100 text-orange-600 hover:bg-orange-200 px-4 py-2 rounded-xl h-auto flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        {format}
                      </AnimatedButton>
                    ))}
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </div>

        {/* Export All */}
        <div className="mt-6">
          <AnimatedButton
            onClick={() => alert("Exporting all reports as ZIP file...")}
            className="w-full h-14 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export All Reports (ZIP)
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
}
