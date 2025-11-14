import { useState } from "react";
import {
  Check,
  X,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

const improvements = [
  {
    id: 1,
    category: "Liability",
    level: "high",
    original:
      "Provider shall be liable for any and all damages arising from this agreement without limitation.",
    improved:
      "Provider's total liability under this agreement shall be limited to the greater of (i) the total fees paid by Client in the twelve (12) months preceding the claim, or (ii) $100,000. This limitation shall not apply to: (a) Provider's gross negligence or willful misconduct, (b) violations of intellectual property rights, or (c) breaches of confidentiality obligations.",
    changes: [
      "Added liability cap based on contract value",
      "Specified exceptions where unlimited liability applies",
      "Protected against catastrophic financial exposure",
      "Maintained accountability for serious breaches",
    ],
    rationale:
      "Unlimited liability exposes the Provider to potentially catastrophic financial risk. A reasonable cap protects both parties while maintaining appropriate accountability for serious breaches.",
    status: "pending",
  },
  {
    id: 2,
    category: "IP Rights",
    level: "high",
    original:
      "All intellectual property created during the engagement, including but not limited to source code, documentation, designs, and any derivative works, shall be assigned to Client.",
    improved:
      'All intellectual property specifically created for and funded by Client under this agreement ("Foreground IP") shall be assigned to Client. Provider retains all rights to pre-existing intellectual property, tools, methodologies, and frameworks ("Background IP") that existed prior to this engagement or are used across multiple clients. Client receives a perpetual, royalty-free license to use Background IP as incorporated in deliverables.',
    changes: [
      "Distinguished between Foreground IP and Background IP",
      "Protected Provider's pre-existing tools and frameworks",
      "Granted Client appropriate license to use Background IP",
      "Clarified scope of IP assignment",
    ],
    rationale:
      "Assigning all IP including pre-existing tools would prevent Provider from using their standard toolset with other clients. This revision protects Provider's business model while ensuring Client gets what they paid for.",
    status: "pending",
  },
  {
    id: 3,
    category: "Payment Terms",
    level: "medium",
    original: "Client shall pay Provider within 90 days of invoice date.",
    improved:
      "Client shall pay Provider within 45 days of invoice date. Late payments shall incur interest at the rate of 1.5% per month (18% per annum) or the maximum rate permitted by law, whichever is lower. If payment is more than 30 days overdue, Provider may suspend services until payment is received.",
    changes: [
      "Reduced payment terms from Net 90 to Net 45",
      "Added late payment interest charges",
      "Included right to suspend services for non-payment",
      "Specified interest rate calculation",
    ],
    rationale:
      "Net 90 terms create significant cash flow challenges. Net 45 is more standard in the industry while late payment provisions provide necessary protection and incentive for timely payment.",
    status: "pending",
  },
  {
    id: 4,
    category: "Termination",
    level: "medium",
    original:
      "Either party may terminate this agreement with 30 days written notice.",
    improved:
      "Either party may terminate this agreement without cause upon 90 days written notice. Either party may terminate immediately for material breach if such breach remains uncured for 15 days after written notice. Upon termination, Client shall pay for all work completed through the termination date, and Provider shall deliver all completed deliverables.",
    changes: [
      "Extended notice period from 30 to 90 days",
      "Added immediate termination for material breach",
      "Included cure period for breach",
      "Specified payment and deliverable obligations upon termination",
    ],
    rationale:
      "30 days is insufficient for resource planning and transition. 90 days allows for proper wind-down while immediate termination for material breach provides necessary protection.",
    status: "pending",
  },
];

export function ClauseImprovement() {
  const [clauseStates, setClauseStates] = useState<
    Record<number, "pending" | "accepted" | "rejected">
  >(Object.fromEntries(improvements.map((imp) => [imp.id, "pending"])));
  const [expandedChanges, setExpandedChanges] = useState<Set<number>>(
    new Set([1])
  );

  const handleAccept = (id: number) => {
    setClauseStates((prev) => ({ ...prev, [id]: "accepted" }));
  };

  const handleReject = (id: number) => {
    setClauseStates((prev) => ({ ...prev, [id]: "rejected" }));
  };

  const toggleChanges = (id: number) => {
    setExpandedChanges((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getBadgeColor = (level: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "border-green-500 bg-green-500/10";
      case "rejected":
        return "border-red-500 bg-red-500/10";
      default:
        return "border-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-white mb-2">AI-Suggested Improvements</h2>
        <p className="text-gray-400">
          Review and apply AI-generated improvements to risky clauses
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-white mb-1">{improvements.length}</div>
              <div className="text-gray-400 text-sm">Total Suggestions</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-white mb-1">
                {
                  Object.values(clauseStates).filter((s) => s === "accepted")
                    .length
                }
              </div>
              <div className="text-gray-400 text-sm">Accepted</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-white mb-1">
                {
                  Object.values(clauseStates).filter((s) => s === "pending")
                    .length
                }
              </div>
              <div className="text-gray-400 text-sm">Pending Review</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Improvements List */}
      <div className="space-y-6">
        {improvements.map((improvement) => (
          <Card
            key={improvement.id}
            className={`bg-[#1a1a1a] border-2 transition-all ${getStatusColor(
              clauseStates[improvement.id]
            )}`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#EE0000]" />
                  <CardTitle className="text-white">
                    {improvement.category}
                  </CardTitle>
                  <Badge className={getBadgeColor(improvement.level)}>
                    {improvement.level.toUpperCase()}
                  </Badge>
                </div>
                {clauseStates[improvement.id] === "accepted" && (
                  <Badge className="bg-green-500 text-white">
                    <Check className="w-4 h-4 mr-1" />
                    Accepted
                  </Badge>
                )}
                {clauseStates[improvement.id] === "rejected" && (
                  <Badge className="bg-red-500 text-white">
                    <X className="w-4 h-4 mr-1" />
                    Rejected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Split View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original */}
                <div>
                  <h4 className="text-white mb-3 flex items-center gap-2">
                    <X className="w-4 h-4 text-red-500" />
                    Original Clause
                  </h4>
                  <div className="bg-[#0f0f0f] border border-red-500/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {improvement.original}
                    </p>
                  </div>
                </div>

                {/* Improved */}
                <div>
                  <h4 className="text-white mb-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Improved Version
                  </h4>
                  <div className="bg-[#0f0f0f] border border-green-500/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {improvement.improved}
                    </p>
                  </div>
                </div>
              </div>

              {/* Changes Made */}
              <div>
                <button
                  onClick={() => toggleChanges(improvement.id)}
                  className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors mb-3"
                >
                  {expandedChanges.has(improvement.id) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  <h4>Changes Made</h4>
                </button>
                {expandedChanges.has(improvement.id) && (
                  <ul className="space-y-2 ml-6">
                    {improvement.changes.map((change, idx) => (
                      <li
                        key={idx}
                        className="text-gray-300 text-sm flex items-start gap-2"
                      >
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Legal Rationale */}
              <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-4">
                <h4 className="text-white mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
                  Legal Rationale
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {improvement.rationale}
                </p>
              </div>

              {/* Action Buttons */}
              {clauseStates[improvement.id] === "pending" && (
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => handleAccept(improvement.id)}
                    className="flex-1 bg-[#EE0000] hover:bg-[#CC0000] text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Accept & Apply
                  </Button>
                  <Button
                    onClick={() => handleReject(improvement.id)}
                    variant="outline"
                    className="flex-1 bg-transparent border-gray-700 text-white hover:bg-gray-800"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Final Actions */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white mb-2">Ready to apply changes?</h3>
              <p className="text-gray-400 text-sm">
                {
                  Object.values(clauseStates).filter((s) => s === "accepted")
                    .length
                }{" "}
                improvements accepted
              </p>
            </div>
            <Button className="bg-[#EE0000] hover:bg-[#CC0000] text-white px-8">
              Generate Updated Document
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
