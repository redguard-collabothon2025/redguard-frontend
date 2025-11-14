import { useState } from "react";
import {
  AlertTriangle,
  FileText,
  TrendingUp,
  Activity,
  Filter,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const riskData = [
  { name: "Liability", value: 8, color: "#EF4444" },
  { name: "Payment Terms", value: 5, color: "#F59E0B" },
  { name: "Termination", value: 3, color: "#FFF176" },
  { name: "IP Rights", value: 6, color: "#EF4444" },
];

const risks = [
  {
    id: 1,
    level: "high",
    category: "Liability",
    title: "Unlimited liability clause",
    description: "Contract contains unlimited liability exposure without cap",
    section: "Section 8.2",
  },
  {
    id: 2,
    level: "high",
    category: "Payment Terms",
    title: "No late payment penalties",
    description: "Missing provisions for late payment protection",
    section: "Section 4.1",
  },
  {
    id: 3,
    level: "high",
    category: "IP Rights",
    title: "Broad IP assignment",
    description:
      "IP assignment clause is overly broad and may include background IP",
    section: "Section 12.3",
  },
  {
    id: 4,
    level: "medium",
    category: "Termination",
    title: "Short notice period",
    description: "Termination notice period of 30 days may be insufficient",
    section: "Section 10.1",
  },
  {
    id: 5,
    level: "medium",
    category: "Payment Terms",
    title: "Extended payment terms",
    description: "Net 90 payment terms increase cash flow risk",
    section: "Section 4.3",
  },
  {
    id: 6,
    level: "low",
    category: "General",
    title: "Governing law clarity",
    description:
      "Governing law clause could be more specific about jurisdiction",
    section: "Section 15.2",
  },
];

export function RiskDashboard() {
  const [sortBy, setSortBy] = useState("level");
  const [filterLevel, setFilterLevel] = useState("all");
  const [expandedRisk, setExpandedRisk] = useState<number | null>(null);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-[#EF4444] text-white";
      case "medium":
        return "bg-[#F59E0B] text-white";
      case "low":
        return "bg-[#FFF176] text-black";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const filteredRisks = risks.filter((risk) =>
    filterLevel === "all" ? true : risk.level === filterLevel
  );

  const highRiskCount = risks.filter((r) => r.level === "high").length;
  const mediumRiskCount = risks.filter((r) => r.level === "medium").length;
  const lowRiskCount = risks.filter((r) => r.level === "low").length;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-white mb-2">Risk Analysis Dashboard</h2>
        <p className="text-gray-400">Comprehensive contract risk overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#1a1a1a] border-gray-800 border-2 border-[#EE0000]">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-400 text-sm">Total Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-white mb-1">{risks.length}</div>
                <div className="text-gray-400 text-sm">Issues Found</div>
              </div>
              <FileText className="w-8 h-8 text-[#EE0000]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-400 text-sm">
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-white mb-1">{highRiskCount}</div>
                <div className="text-gray-400 text-sm">Urgent</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-[#EF4444]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-400 text-sm">Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-white mb-1">72/100</div>
                <div className="text-gray-400 text-sm">High Risk</div>
              </div>
              <Activity className="w-8 h-8 text-[#F59E0B]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-400 text-sm">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-white mb-1">4</div>
                <div className="text-gray-400 text-sm">Risk Types</div>
              </div>
              <TrendingUp className="w-8 h-8 text-[#10B981]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              Risk Distribution by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  wrapperStyle={{ color: "#fff" }}
                  formatter={(value) => (
                    <span className="text-white">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Risk Level Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-[#EF4444] rounded"></div>
                <span className="text-white">High Risk</span>
              </div>
              <span className="text-white">{highRiskCount} issues</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-[#F59E0B] rounded"></div>
                <span className="text-white">Medium Risk</span>
              </div>
              <span className="text-white">{mediumRiskCount} issues</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-[#FFF176] rounded"></div>
                <span className="text-white">Low Risk</span>
              </div>
              <span className="text-white">{lowRiskCount} issues</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk List */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Detailed Risk Analysis</CardTitle>
            <div className="flex gap-3">
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-40 bg-[#0f0f0f] border-gray-700 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-gray-700">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRisks.map((risk) => (
              <div
                key={risk.id}
                className="p-4 bg-[#0f0f0f] border border-gray-800 rounded-lg hover:border-gray-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getRiskColor(risk.level)}>
                        {risk.level.toUpperCase()}
                      </Badge>
                      <span className="text-gray-400 text-sm">
                        {risk.category}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {risk.section}
                      </span>
                    </div>
                    <h4 className="text-white mb-2">{risk.title}</h4>
                    <p className="text-gray-400 text-sm mb-3">
                      {risk.description}
                    </p>
                    {expandedRisk === risk.id && (
                      <div className="mt-4 p-4 bg-black border border-gray-800 rounded">
                        <h5 className="text-white mb-2">Detailed Analysis</h5>
                        <p className="text-gray-400 text-sm mb-3">
                          This risk could expose your organization to
                          significant liability. We recommend implementing a cap
                          on liability or adding specific exclusions.
                        </p>
                        <h5 className="text-white mb-2">Recommendation</h5>
                        <p className="text-gray-400 text-sm">
                          Negotiate a liability cap of no more than 2x the
                          contract value, or add specific exclusions for
                          indirect, consequential, and punitive damages.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setExpandedRisk(
                          expandedRisk === risk.id ? null : risk.id
                        )
                      }
                      className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
                    >
                      {expandedRisk === risk.id ? "Hide" : "Details"}
                      <ChevronDown
                        className={`w-4 h-4 ml-2 transition-transform ${
                          expandedRisk === risk.id ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
                    >
                      View in Doc
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
