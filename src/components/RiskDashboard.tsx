import { useState, useEffect } from "react";
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
// PieChart imports kept for future use / extension
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

type RiskLevel = "low" | "medium" | "high";

interface TopRisk {
  id: number;
  level: RiskLevel;
  category: string;
  title: string;
  description: string;
  section?: string | null;
  impact?: string | null;
  recommendation?: string | null;
}

interface CategoryScore {
  name: string;
  value: number;
}

interface Summary {
  overallRisk: RiskLevel;
  riskScore: number;
  criticalIssues: number;
  mediumIssues: number;
  lowIssues: number;
  recommendation: string;
}

interface ContractAnalysis {
  contractId: string;
  fileName: string;
  uploadedAt: string;
  summary: Summary;
  categories: CategoryScore[];
  topRisks: TopRisk[];
  // other fields exist in backend, but we don't need them here
}

interface ContractListItem {
  contractId: string;
  fileName: string;
  uploadedAt: string;
  overallRisk: RiskLevel;
  riskScore: number;
}

interface ContractListResponse {
  items: ContractListItem[];
}

interface RiskDashboardProps {
  handleSwitchToViewer: () => void;
}

// Base URL – configure via Vite env or fall back to same-origin
const API_BASE_URL =
  "http://redguard-backend-redguard.apps.cluster-d5t2f.d5t2f.sandbox2788.opentlc.com";

export function RiskDashboard({ handleSwitchToViewer }: RiskDashboardProps) {
  const [filterLevel, setFilterLevel] = useState<"all" | RiskLevel>("all");
  const [expandedRisk, setExpandedRisk] = useState<number | null>(null);

  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- Fetch latest contract + analysis from backend ----------
  useEffect(() => {
    const loadLatestAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Get list of contracts
        const listRes = await fetch(`${API_BASE_URL}/api/contracts`);
        if (!listRes.ok) {
          throw new Error(`List request failed with ${listRes.status}`);
        }
        const listJson: ContractListResponse = await listRes.json();

        if (!listJson.items || listJson.items.length === 0) {
          setAnalysis(null);
          return;
        }

        // Here we simply take the latest item (last in array)
        const latest = listJson.items[listJson.items.length - 1];

        // 2) Get full analysis for that contract
        const detailRes = await fetch(
          `${API_BASE_URL}/api/contracts/${latest.contractId}`
        );
        if (!detailRes.ok) {
          throw new Error(`Detail request failed with ${detailRes.status}`);
        }
        const detailJson: ContractAnalysis = await detailRes.json();
        setAnalysis(detailJson);
      } catch (e: any) {
        console.error(e);
        setError("Failed to load contract analysis from backend.");
      } finally {
        setLoading(false);
      }
    };

    loadLatestAnalysis();
  }, []);

  // const risks: TopRisk[] = analysis?.topRisks ?? [];
  const risks: TopRisk[] = [
    {
      id: 1,
      level: "high",
      category: "Penalties",
      title: "2000 PLN penalty for withdrawal without notice",
      description:
        "The contract introduces a fixed 2000 PLN penalty if you terminate without respecting the 3-month notice period.",
      section: "§8 ust. 1(a)",
    },
    {
      id: 2,
      level: "high",
      category: "Penalties",
      title: "Up to 1000 PLN penalty for vague 'gross actions'",
      description:
        "Penalty up to 1000 PLN based on subjective interpretation of 'gross actions or omissions', which may be abused.",
      section: "§8 ust. 1(b)",
    },
    {
      id: 3,
      level: "high",
      category: "Work Hours",
      title: "Mandatory extra lessons if minimum exceeded",
      description:
        "If minimum required hours are exceeded unintentionally, you are obligated to conduct additional lessons unless you explicitly notify.",
      section: "§2 ust. 6",
    },
    {
      id: 4,
      level: "high",
      category: "Non-compete",
      title: "Non-compete clause without compensation",
      description:
        "Prohibits tutoring or similar services to any of the Principal’s clients without compensation. Legally questionable in Poland.",
      section: "§7 ust. 2",
    },
    {
      id: 5,
      level: "high",
      category: "Travel",
      title: "Required travel to clients’ homes (no reimbursement)",
      description:
        "Contractor must travel to each client’s residence without reimbursement or distance limits.",
      section: "§2 ust. 1",
    },
    {
      id: 6,
      level: "high",
      category: "Work Hours",
      title: "Obligation to report inability to meet hours",
      description:
        "Responsibility for unmet hours is shifted onto the Contractor, even though assigning clients is the Principal’s duty.",
      section: "§2 ust. 5",
    },

    // 🟡 MEDIUM RISKS ---------------------------------------------------
    {
      id: 7,
      level: "medium",
      category: "Work Hours",
      title: "Minimum weekly hours obligation",
      description:
        "Requires 5 hours weekly in September and 20 hours weekly from October. May be unrealistic if clients aren’t assigned.",
      section: "§2 ust. 4",
    },
    {
      id: 8,
      level: "medium",
      category: "Operational",
      title: "Obligation to call clients the same day",
      description:
        "Must call clients on the same day to schedule lessons. Missing deadlines may be interpreted as improper performance.",
      section: "§3 ust. 1",
    },
    {
      id: 9,
      level: "medium",
      category: "Operational",
      title: "Immediate absence notification requirement",
      description:
        "Must immediately inform both client and Principal upon inability to attend a lesson.",
      section: "§4 ust. 3",
    },
    {
      id: 10,
      level: "medium",
      category: "Payment Terms",
      title: "Payment may be delayed for missing documents",
      description:
        "Payment can be delayed if attendance lists or monthly summaries are submitted late. No maximum delay specified.",
      section: "§5 ust. 5",
    },
    {
      id: 11,
      level: "medium",
      category: "Termination",
      title: "3-month notice period",
      description:
        "Unusually long notice period for B2B/civil contracts. Reduces flexibility to change jobs.",
      section: "§6 ust. 1(a)",
    },

    // ✅ LOW RISKS ------------------------------------------------------
    {
      id: 12,
      level: "low",
      category: "Professional Standards",
      title: "Due diligence clause",
      description:
        "Standard confirmation that Contractor performs tasks with due diligence and ethics.",
      section: "§1 ust. 2",
    },
    {
      id: 13,
      level: "low",
      category: "Operational",
      title: "Reporting frequent cancellations",
      description:
        "Contractor must report frequent cancellations by students. Purely administrative duty.",
      section: "§4 ust. 2",
    },
    {
      id: 14,
      level: "low",
      category: "Payment Terms",
      title: "Defined payment date mechanism",
      description:
        "Payment date is when Principal’s account is debited. Typical clause; minor risk of slight delays.",
      section: "§5 ust. 4",
    },
  ];

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case "high":
        return "bg-[#FF2D2D] text-[#E6E6E9]";
      case "medium":
        return "bg-[#F59E0B] text-black";
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

  // Optional: riskData from categories (for PieChart, if you uncomment it later)
  const riskData =
    analysis?.categories?.map((c, idx) => ({
      name: c.name,
      value: c.value,
      color: ["#FF2D2D", "#F59E0B", "#FFF176", "#FF4747", "#22C55E"][idx % 5],
    })) ?? [];

  if (loading) {
    return (
      <div className="container mx-auto py-4">
        <p className="text-sm text-[#9A9AA2]">Loading risk dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-4">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="container mx-auto py-4">
        <p className="text-sm text-[#9A9AA2]">
          No analyzed contracts found. Upload a document first.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-2 space-y-8">
      {/* Risk list */}
      <Card className="bg-[#1A1A1D] border border-[#262629]">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold text-[#E6E6E9]">
              Detailed Risk Analysis
            </CardTitle>
            <Select
              value={filterLevel}
              onValueChange={(val) => setFilterLevel(val as "all" | RiskLevel)}
            >
              <SelectTrigger className="w-40 bg-[#0D0D0F] border-[#262629] text-xs text-[#E6E6E9]">
                <div className="flex w-full items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="All levels" />
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1D] border-[#262629] text-[#E6E6E9]">
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRisks.map((risk) => (
              <div
                key={risk.id}
                className="rounded-xl border border-[#262629] bg-[#0D0D0F] p-4 transition-all duration-200 hover:border-[#FF2D2D]/60 hover:shadow-[0_16px_40px_rgba(0,0,0,0.85)] hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <Badge
                        className={cn(
                          "px-2 py-0.5 text-[11px] font-semibold",
                          getRiskColor(risk.level)
                        )}
                      >
                        {risk.level.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-[#9A9AA2]">
                        {risk.category}
                      </span>
                      {risk.section && (
                        <span className="text-xs text-[#555565]">
                          {risk.section}
                        </span>
                      )}
                    </div>
                    <h4 className="mb-1 text-sm font-semibold text-[#E6E6E9]">
                      {risk.title}
                    </h4>
                    <p className="mb-2 text-xs text-[#9A9AA2]">
                      {risk.description}
                    </p>

                    {expandedRisk === risk.id && (
                      <div className="mt-3 rounded-lg border border-[#262629] bg-black/70 p-4">
                        <h5 className="mb-2 text-sm font-semibold text-[#E6E6E9]">
                          Detailed Analysis
                        </h5>
                        <p className="mb-3 text-xs text-[#9A9AA2]">
                          {risk.impact ||
                            "This risk could expose your organization to significant liability or commercial exposure."}
                        </p>
                        {risk.recommendation && (
                          <>
                            <h5 className="mb-2 text-sm font-semibold text-[#E6E6E9]">
                              Recommendation
                            </h5>
                            <p className="text-xs text-[#9A9AA2]">
                              {risk.recommendation}
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setExpandedRisk(
                          expandedRisk === risk.id ? null : risk.id
                        )
                      }
                      className="border-[#262629] bg-transparent text-xs text-[#E6E6E9] hover:bg-[#1A1A1D] hover:text-white"
                    >
                      {expandedRisk === risk.id ? "Hide details" : "Details"}
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform ${
                          expandedRisk === risk.id ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                    <Button
                      onClick={handleSwitchToViewer}
                      variant="outline"
                      size="sm"
                      className="border-[#262629] bg-transparent text-xs text-[#E6E6E9] hover:bg-[#1A1A1D] hover:text-white"
                    >
                      View in doc
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredRisks.length === 0 && (
              <p className="text-xs text-[#9A9AA2]">
                No risks for the selected filter.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// small helper so Badge can accept combined classes
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
