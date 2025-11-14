import { useState } from "react";
import { ArrowLeftRight, Plus, Minus, Edit, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

const changes = [
  {
    id: 1,
    type: "modified",
    section: "Section 4.1 - Liability",
    original:
      "Provider shall be liable for any and all damages arising from this agreement without limitation.",
    revised:
      "Provider's total liability under this agreement shall be limited to the greater of (i) the total fees paid by Client in the twelve (12) months preceding the claim, or (ii) $100,000.",
    impact: "high",
    description: "Added liability cap to protect against unlimited exposure",
  },
  {
    id: 2,
    type: "modified",
    section: "Section 3.1 - Intellectual Property",
    original:
      "All intellectual property created during the engagement shall be assigned to Client.",
    revised:
      'All intellectual property specifically created for and funded by Client under this agreement ("Foreground IP") shall be assigned to Client. Provider retains all rights to pre-existing intellectual property.',
    impact: "high",
    description: "Distinguished between foreground and background IP",
  },
  {
    id: 3,
    type: "modified",
    section: "Section 2.1 - Payment Terms",
    original: "Client shall pay Provider within 90 days of invoice date.",
    revised:
      "Client shall pay Provider within 45 days of invoice date. Late payments shall incur interest at the rate of 1.5% per month.",
    impact: "medium",
    description: "Reduced payment terms and added late payment penalties",
  },
  {
    id: 4,
    type: "added",
    section: "Section 4.2 - Liability Exceptions",
    original: "",
    revised:
      "This limitation shall not apply to: (a) Provider's gross negligence or willful misconduct, (b) violations of intellectual property rights, or (c) breaches of confidentiality obligations.",
    impact: "medium",
    description: "Added exceptions to liability cap",
  },
  {
    id: 5,
    type: "modified",
    section: "Section 5.1 - Termination Notice",
    original:
      "Either party may terminate this agreement with 30 days written notice.",
    revised:
      "Either party may terminate this agreement without cause upon 90 days written notice.",
    impact: "medium",
    description: "Extended termination notice period",
  },
  {
    id: 6,
    type: "added",
    section: "Section 5.3 - Termination Obligations",
    original: "",
    revised:
      "Upon termination, Client shall pay for all work completed through the termination date, and Provider shall deliver all completed deliverables.",
    impact: "low",
    description: "Added termination payment and deliverable obligations",
  },
];

export function ComparisonMode() {
  const [selectedChange, setSelectedChange] = useState<number>(1);

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "added":
        return <Plus className="w-4 h-4 text-green-500" />;
      case "removed":
        return <Minus className="w-4 h-4 text-red-500" />;
      case "modified":
        return <Edit className="w-4 h-4 text-[#F59E0B]" />;
      default:
        return null;
    }
  };

  const getChangeBg = (type: string) => {
    switch (type) {
      case "added":
        return "bg-green-500/10 border-green-500/30";
      case "removed":
        return "bg-red-500/10 border-red-500/30";
      case "modified":
        return "bg-[#F59E0B]/10 border-[#F59E0B]/30";
      default:
        return "bg-gray-800";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
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

  const selectedChangeData = changes.find((c) => c.id === selectedChange);

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-white mb-2">Document Comparison</h2>
        <p className="text-gray-400">
          Compare original contract with AI-improved version
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white mb-1">{changes.length}</div>
                <div className="text-gray-400 text-sm">Total Changes</div>
              </div>
              <ArrowLeftRight className="w-8 h-8 text-[#EE0000]" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white mb-1">
                  {changes.filter((c) => c.type === "modified").length}
                </div>
                <div className="text-gray-400 text-sm">Modified</div>
              </div>
              <Edit className="w-8 h-8 text-[#F59E0B]" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white mb-1">
                  {changes.filter((c) => c.type === "added").length}
                </div>
                <div className="text-gray-400 text-sm">Added</div>
              </div>
              <Plus className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white mb-1">
                  {changes.filter((c) => c.impact === "high").length}
                </div>
                <div className="text-gray-400 text-sm">High Impact</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-[#EF4444]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Comparison View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Changes List - Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Changes Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {changes.map((change) => (
                    <button
                      key={change.id}
                      onClick={() => setSelectedChange(change.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedChange === change.id
                          ? "border-[#EE0000] bg-[#EE0000]/10"
                          : "border-gray-800 bg-[#0f0f0f] hover:border-gray-700"
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        {getChangeIcon(change.type)}
                        <div className="flex-1">
                          <p className="text-white text-sm mb-1">
                            {change.section}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {change.description}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`${getImpactColor(change.impact)} text-xs`}
                      >
                        {change.impact.toUpperCase()}
                      </Badge>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="lg:col-span-2">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">
                  {selectedChangeData?.section}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {selectedChangeData && getChangeIcon(selectedChangeData.type)}
                  <Badge
                    className={
                      selectedChangeData
                        ? getImpactColor(selectedChangeData.impact)
                        : ""
                    }
                  >
                    {selectedChangeData?.impact.toUpperCase()} IMPACT
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original */}
                <div>
                  <h4 className="text-white mb-4 flex items-center gap-2">
                    Original Version
                  </h4>
                  <div
                    className={`rounded-lg border p-4 min-h-[200px] ${
                      selectedChangeData?.type === "added"
                        ? "bg-gray-900/50 border-gray-800"
                        : getChangeBg("removed")
                    }`}
                  >
                    {selectedChangeData?.original ? (
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {selectedChangeData.type === "removed" && (
                          <span className="line-through">
                            {selectedChangeData.original}
                          </span>
                        )}
                        {selectedChangeData.type === "modified" && (
                          <span className="bg-red-500/20">
                            {selectedChangeData.original}
                          </span>
                        )}
                        {selectedChangeData.type === "added" && (
                          <span className="text-gray-500 italic">
                            No previous content
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic text-sm">
                        No previous content
                      </p>
                    )}
                  </div>
                </div>

                {/* Revised */}
                <div>
                  <h4 className="text-white mb-4 flex items-center gap-2">
                    Revised Version
                  </h4>
                  <div
                    className={`rounded-lg border p-4 min-h-[200px] ${
                      selectedChangeData?.type === "removed"
                        ? "bg-gray-900/50 border-gray-800"
                        : getChangeBg(selectedChangeData?.type || "modified")
                    }`}
                  >
                    {selectedChangeData?.revised ? (
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {selectedChangeData.type === "added" && (
                          <span className="bg-green-500/20">
                            {selectedChangeData.revised}
                          </span>
                        )}
                        {selectedChangeData.type === "modified" && (
                          <span className="bg-green-500/20">
                            {selectedChangeData.revised}
                          </span>
                        )}
                        {selectedChangeData.type === "removed" && (
                          <span className="text-gray-500 italic">
                            Content removed
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic text-sm">
                        Content removed
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Impact Assessment */}
              <div className="mt-6 p-4 bg-[#0f0f0f] border border-gray-800 rounded-lg">
                <h4 className="text-white mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  Impact Assessment
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {selectedChangeData?.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => {
                const currentIndex = changes.findIndex(
                  (c) => c.id === selectedChange
                );
                if (currentIndex > 0) {
                  setSelectedChange(changes[currentIndex - 1].id);
                }
              }}
              disabled={selectedChange === changes[0].id}
              variant="outline"
              className="bg-transparent border-gray-700 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              Previous Change
            </Button>
            <Button
              onClick={() => {
                const currentIndex = changes.findIndex(
                  (c) => c.id === selectedChange
                );
                if (currentIndex < changes.length - 1) {
                  setSelectedChange(changes[currentIndex + 1].id);
                }
              }}
              disabled={selectedChange === changes[changes.length - 1].id}
              variant="outline"
              className="bg-transparent border-gray-700 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              Next Change
            </Button>
            <Button className="ml-auto bg-[#EE0000] hover:bg-[#CC0000] text-white">
              Export Comparison Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
