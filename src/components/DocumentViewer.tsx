import { useEffect, useState, useRef, type JSX } from "react";
import { AlertTriangle, ChevronRight, Lightbulb } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "../utils/utils";

/* -----------------------------------------
   Type definitions
------------------------------------------ */

type RiskLevel = "low" | "medium" | "high";

interface IssueDetail {
  id: string;
  type: string;
  severity: RiskLevel;
  snippet: string;
  explanation: string;
  suggestedFix?: string;
}

interface Section {
  id: string;
  heading?: string;
  text: string;
  riskLevel: RiskLevel;
  issues: IssueDetail[];
}

interface DocumentData {
  title?: string;
  sections: Section[];
}

interface Summary {
  overallRisk: RiskLevel;
  riskScore: number;
}

interface ContractAnalysis {
  contractId: string;
  fileName: string;
  uploadedAt: string;
  document: DocumentData;
  summary: Summary;
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

/* -----------------------------------------
   Highlight type
------------------------------------------ */

interface Highlight {
  start: number;
  end: number;
  level: RiskLevel;
  text: string;
  riskId: string;
  issue: IssueDetail;
}

/* -----------------------------------------
   API base URL
------------------------------------------ */

const API_BASE_URL =
  "http://redguard-backend-redguard.apps.cluster-d5t2f.d5t2f.sandbox2788.opentlc.com";
const hardCodedText = `Warsaw, 25.07.2023
EduKing Private Tutoring
NIP: 7011119240
REGON: 523890397
Stefan Batory Street 18/108
02-591 Warsaw
SERVICE CONTRACT
DATE OF CONCLUSION CONTRACT NUMBER
25.07.2023 13/2023/24
PRINCIPAL CONTRACTOR
EduKing Private Tutoring ………………………
Stefan Batory Street 18/108 ………………………
02-591 Warsaw ………………………
§1
SUBJECT OF THE CONTRACT
1. The Principal commissions, and the Contractor undertakes to perform the
following work:
Providing tutoring lessons
The work is to be performed from 21.08.2023 to 30.06.2024.
2. The Contractor accepts the assignment and undertakes to perform the entrusted
tasks with due diligence and in accordance with professional ethics.
3. The Contractor may not transfer the performance of any tasks arising from this
contract to another person without the Principal’s consent.
4. The Principal undertakes to provide materials necessary for organizing and
conducting lessons, and the Contractor agrees to use them during the lessons.
§2
SCOPE OF COOPERATION
1. The Contractor shall provide the Services under this Contract at the Client’s
place of residence and declares that they are able to travel to the place of
service delivery until the end of the contract.
2. The Contractor undertakes to provide Services in the following area:
Łódź
3. The Contractor shall perform the activities covered by the Contract to the extent
necessary for its proper execution.
4. The Contractor commits to conducting at least 5 hours per week in September
and 20 hours per week from October onward.
5. If the Contractor does not have a sufficient number of Clients to meet the agreed
number of hours, they must inform the Principal each time.
6. If the Contractor exceeds the minimum number of hours stated in point 4, they
should notify the Principal if they do not intend to conduct additional lessons in
that settlement period; otherwise, they will be obliged to conduct additional
lessons beyond the minimum hours. The Contractor will be responsible for the
newly acquired Client just as for Clients assigned based on prior declarations.
7. The Contractor declares that they possess the required competencies and
agrees to conduct tutoring in the following subjects:
• Mathematics at secondary school basic level and lower
• English at secondary school extended level and lower
§3
SCHEDULING LESSONS
1. The Contractor receives Client information via SMS. After reading the message,
they must call the Client on the same day to schedule the first lesson, and then
inform the Principal about the arranged date on the same day.
2. If the Client does not answer the phone twice, the Contractor must send an SMS
in which they greet the Client, introduce themselves, and ask about availability.
3. For the next three days, the Contractor should continue attempts to contact the
Client and inform the Principal about the results.
§4
CANCELLATION OF LESSONS
1. The Contractor must start each lesson punctually. If the student is late, the
Contractor is not obliged to extend the lesson. If the Contractor arrives for a
lesson and the student is absent, they must stay for 10 minutes at the
designated location while attempting to contact the student.
2. In case of frequent cancellations by the student, the Contractor must inform the
Principal.
3. If the Contractor cannot attend a scheduled lesson, they must immediately
inform both the Client and the Principal. This must be done every time the
Contractor is absent.
4. If a Client resigns from tutoring, the Contractor must inform the Principal and
indicate how many hours per week they can take on to replace the resigned
Client.
§5
REMUNERATION
1. For performing this Contract, the Principal shall pay the Contractor a monthly
remuneration calculated as an hourly rate of 30 PLN gross for each hour spent
performing the tasks specified in this Contract.
2. Additionally, a bonus depending on the number of hours worked in a month is
established:
• 60–64 h → +2 PLN per hour
• 65–69 h → +4 PLN per hour
• 70–74 h → +6 PLN per hour
• 75–79 h → +8 PLN per hour
• 80 h or more → +10 PLN per hour
3. The basis for determining the number of hours is correctly completed reports
and attendance lists from the conducted lessons. These must be submitted by
the last day of each month as a scan via email to: eduking@vp.pl
4. The payment date is considered the day the Principal’s account is debited, i.e.,
the 10th day of the month following the month in which the lessons were
conducted. If this falls on a holiday or non-working day, the payment is made on
the next working day.
5. If the Contractor does not submit attendance lists and the monthly summary on
time, the payment may be delayed.
§6
TERMINATION OF CONTRACT
1. The Contract may be terminated for valid reasons, which must be documented
by the Contractor:
a) By notice with a 3-month notice period, counted from the date of delivery or deemed
delivery of the notice (statement reaching the addressee), in accordance with the Civil
Code.
b) Immediately by the Principal in the event of a gross breach of this Contract by the
Contractor.
§7
DUTY OF LOYALTY
1. Each party must remain loyal to the other, particularly by respecting its interests
and refraining from behavior that could harm its reputation.
2. The Contractor undertakes not to engage in competitive activity, especially
providing tutoring services to Clients of the Principal.
§8
CONTRACTUAL PENALTIES
1. The Contractor must pay contractual penalties in the following cases:
a) Withdrawal from the Contract without respecting the notice period — penalty: 2000
PLN.
b) If due to gross actions or omissions of the Contractor the good name of the Principal
is violated, cooperation with a Client is jeopardized, or contract terms are not fulfilled —
penalty up to 1000 PLN to cover damages.
2. In such circumstances, the Principal may deduct the penalty from the
remuneration specified in §5. By signing the Contract, the Contractor agrees to
such deductions.
§9
FINAL PROVISIONS
1. Matters not regulated by this Contract but relating to its subject are governed by
the Civil Code.
2. Any changes to the Contract must be made in writing.
3. The Contract is drawn up in two identical copies, one for each party.
4. The correspondence addresses of the Parties are those stated in the Contract.
5. The competent court for disputes is the District Court in Katowice, ul.
Francuska 38.
6. The Parties declare that they have reviewed the Contract, negotiated it
individually, understand its contents, and have no objections regarding its terms,
particularly the methods of contact, payment, mutual rights, or obligations.
Principal Contractor
……………………… ………………………
`;
// ---- INTERFACES (zostają jak masz) ----
interface IssueDetail {
  id: string;
  type: string;
  severity: RiskLevel;
  snippet: string;
  explanation: string;
  suggestedFix?: string;
}

interface Highlight {
  start: number;
  end: number;
  level: RiskLevel;
  text: string;
  riskId: string;
  issue: IssueDetail;
}

// ---- ISSUE DETAILS MAPA: id -> IssueDetail ----

const riskDetails: { [id: string]: IssueDetail } = {
  // 🔴 HIGH

  "1": {
    id: "1",
    type: "Penalty / Termination",
    severity: "high",
    snippet:
      "Withdrawal from the Contract without respecting the notice period — penalty: 2000 PLN.",
    explanation:
      "If you withdraw from the Contract without respecting the notice period, you owe a fixed penalty of 2000 PLN. " +
      "This is a high, flat amount that can be disproportionate to the real damage in a tutoring-type contract.",
    suggestedFix:
      "Negotiate either removal of this penalty or replacement with a proportional mechanism (e.g. penalty capped at one month’s average remuneration or documented damage only).",
  },

  "2": {
    id: "2",
    type: "Penalty / Reputation",
    severity: "high",
    snippet:
      "Penalty up to 1000 PLN for 'gross actions or omissions' harming the Principal’s good name.",
    explanation:
      "The clause allows the Principal to impose up to 1000 PLN penalty for 'gross actions or omissions' that harm reputation or cooperation. " +
      "The wording is vague and subjective, which gives the Principal broad discretion.",
    suggestedFix:
      "Limit the penalty to clearly defined, objectively verifiable situations (e.g. proven breach of confidentiality), " +
      "and add a requirement to document the damage. Consider lowering the maximum penalty.",
  },

  "3": {
    id: "3",
    type: "Workload / Hours",
    severity: "high",
    snippet:
      "If the Contractor exceeds the minimum number of hours and does not notify the Principal, they must conduct additional lessons.",
    explanation:
      "If you exceed the minimum number of hours and don’t notify the Principal, you can be obliged to conduct additional lessons beyond the planned minimum. " +
      "You might end up working more than intended, effectively losing control over your workload.",
    suggestedFix:
      "Clarify that any work above the minimum must always be voluntary and agreed in advance, " +
      "and remove the automatic obligation to conduct additional lessons just because the minimum has been exceeded.",
  },

  "4": {
    id: "4",
    type: "Non-compete",
    severity: "high",
    snippet:
      "The Contractor undertakes not to engage in competitive activity, especially providing tutoring services to Clients of the Principal.",
    explanation:
      "You are forbidden from providing tutoring services to the Principal’s clients, without mention of any compensation. " +
      "In Polish practice, a non-compete without compensation is legally problematic and may restrict your ability to earn.",
    suggestedFix:
      "Negotiate either: (a) removal of the clause, (b) clear time/territorial limits, and (c) paid non-compete (monthly compensation) if it is to remain in force.",
  },

  "5": {
    id: "5",
    type: "Travel / Working conditions",
    severity: "high",
    snippet:
      "The Contractor shall provide the Services at the Client’s place of residence and declares that they are able to travel.",
    explanation:
      "You are required to travel to the Client’s place of residence and declare ability to do so, " +
      "but the contract does not define distance limits, travel time or reimbursement. This can lead to unreasonable travel burden.",
    suggestedFix:
      "Add clear limits (maximum distance/time) and rules about travel reimbursement, or allow online lessons by default unless both sides agree otherwise.",
  },

  "6": {
    id: "6",
    type: "Workload responsibility",
    severity: "high",
    snippet:
      "If the Contractor does not have a sufficient number of Clients to meet the agreed number of hours, they must inform the Principal each time.",
    explanation:
      "You are obliged to inform the Principal every time there are not enough clients to reach the agreed hours. " +
      "Responsibility for not meeting the target is partly shifted onto you, although client allocation is the Principal’s role.",
    suggestedFix:
      "Clarify that the Principal is responsible for providing sufficient clients and that lack of clients cannot be treated as your breach. " +
      "Change the duty to a neutral reporting obligation, without negative consequences.",
  },

  // 🟡 MEDIUM

  "7": {
    id: "7",
    type: "Workload / Hours",
    severity: "medium",
    snippet:
      "The Contractor commits to conducting at least 5 hours per week in September and 20 hours per week from October onward.",
    explanation:
      "You commit to at least 5 hours per week in September and 20 hours per week from October. " +
      "If the Principal does not provide enough clients, you may formally fail to meet this obligation.",
    suggestedFix:
      "Add a condition that the minimum hours apply only if the Principal provides sufficient clients and schedule possibilities. " +
      "Alternatively, make the minimum a non-binding target rather than a strict contractual duty.",
  },

  "8": {
    id: "8",
    type: "Operational duty",
    severity: "medium",
    snippet:
      "After reading the message, they must call the Client on the same day to schedule the first lesson and inform the Principal.",
    explanation:
      "You must call the Client and arrange the first lesson on the same day you read the message, and then inform the Principal the same day. " +
      "This is operationally strict and can be difficult to meet on busy or off days.",
    suggestedFix:
      "Replace 'same day' with a more realistic time window (e.g. 24–48 hours on working days) and explicitly allow exceptions for justified reasons.",
  },

  "9": {
    id: "9",
    type: "Operational duty / Absence",
    severity: "medium",
    snippet:
      "If the Contractor cannot attend a scheduled lesson, they must immediately inform both the Client and the Principal.",
    explanation:
      "You must immediately inform both Client and Principal of any absence, every single time. " +
      "This is reasonable in general, but very strict and can easily become a formal breach if something goes wrong.",
    suggestedFix:
      "Clarify acceptable communication channels (e.g. SMS/e-mail) and allow a short reaction window, " +
      "plus explicitly exclude minor delays from being treated as serious breach.",
  },

  "10": {
    id: "10",
    type: "Payment",
    severity: "medium",
    snippet:
      "If the Contractor does not submit attendance lists and the monthly summary on time, the payment may be delayed.",
    explanation:
      "If you don’t submit attendance lists and the monthly summary on time, payment 'may be delayed' without a defined upper limit. " +
      "This gives the Principal wide discretion to hold back your money.",
    suggestedFix:
      "Add a maximum delay period (e.g. no more than X days from providing missing documents) " +
      "and clarify that delays cannot be used as de facto penalty beyond that.",
  },

  "11": {
    id: "11",
    type: "Termination",
    severity: "medium",
    snippet:
      "By notice with a 3-month notice period as of the end of the calendar month.",
    explanation:
      "A 3-month notice period is long for a B2B / civil law tutoring contract. " +
      "It limits your flexibility to change jobs or adjust your workload.",
    suggestedFix:
      "Negotiate a shorter notice (e.g. 1 month), or at least add the possibility of shorter notice by mutual agreement.",
  },

  // ✅ LOW

  "12": {
    id: "12",
    type: "General standard",
    severity: "low",
    snippet:
      "The Contractor accepts the assignment and undertakes to perform the entrusted tasks with due diligence and in accordance with professional ethics.",
    explanation:
      "Standard clause obliging you to act with due diligence and according to professional ethics. " +
      "No direct financial or legal sanctions are attached to this provision.",
    suggestedFix:
      "Usually acceptable as-is. You could add that duties are performed 'within reasonable professional standards' if you want more clarity.",
  },

  "13": {
    id: "13",
    type: "Reporting",
    severity: "low",
    snippet:
      "In case of frequent cancellations by the student, the Contractor must inform the Principal.",
    explanation:
      "You must inform the Principal in case of frequent cancellations by the student. " +
      "This is mainly administrative and does not on its face create penalties.",
    suggestedFix:
      "Leave as-is or clarify what 'frequent' means (e.g. more than X cancellations per month), so expectations are clearer.",
  },

  "14": {
    id: "14",
    type: "Payment date definition",
    severity: "low",
    snippet:
      "The payment date is considered the day the Principal’s account is debited (10th of the month).",
    explanation:
      "The payment date is the day the Principal’s account is debited (10th of the month), " +
      "and if this falls on a non-working day, payment is made on the next working day. " +
      "This is a fairly standard technical rule.",
    suggestedFix:
      "You could ask to add a backstop (e.g. 'no later than the 12th of the month') but generally this clause is low-risk.",
  },
};

// ---- HIGHLIGHTS: używają riskId: string i issue: IssueDetail ----

const hardCodeHighlights: Highlight[] = [
  // 🔴 HIGH RISK

  {
    riskId: "1",
    level: "high",
    start: 5794,
    end: 5881,
    text: "Withdrawal from the Contract without respecting the notice period — penalty: 2000 PLN.",
    issue: riskDetails["1"],
  },
  {
    riskId: "2",
    level: "high",
    start: 5883,
    end: 6108,
    text:
      "b) If due to gross actions or omissions of the Contractor the good name of the Principal\n" +
      "is violated, cooperation with a Client is jeopardized, or contract terms are not fulfilled —\n" +
      "penalty up to 1000 PLN  to cover damages.",
    issue: riskDetails["2"],
  },
  {
    riskId: "3",
    level: "high",
    start: 1833,
    end: 2100,
    text:
      "If the Contractor exceeds the minimum number of hours stated in point 4, they\n" +
      "should notify the Principal if they do not intend to conduct additional lessons in\n" +
      "that settlement period; otherwise, they will be obliged to conduct additional\n" +
      "lessons beyond the minimum.",
    issue: riskDetails["3"],
  },
  {
    riskId: "4",
    level: "high",
    start: 5550,
    end: 5683,
    text:
      "The Contractor undertakes not to engage in competitive activity, especially\n" +
      "providing tutoring services to Clients of the Principal.",
    issue: riskDetails["4"],
  },
  {
    riskId: "5",
    level: "high",
    start: 1145,
    end: 1349,
    text:
      "The Contractor shall provide the Services under this Contract at the Client’s\n" +
      "place of residence and declares that they are able to travel to the place of\n" +
      "service delivery until the end of the contract.",
    issue: riskDetails["5"],
  },
  {
    riskId: "6",
    level: "high",
    start: 1686,
    end: 1827,
    text:
      "If the Contractor does not have a sufficient number of Clients to meet the agreed\n" +
      "number of hours, they must inform the Principal each time.",
    issue: riskDetails["6"],
  },

  // 🟡 MEDIUM RISK

  {
    riskId: "7",
    level: "medium",
    start: 1560,
    end: 1681,
    text:
      "The Contractor commits to conducting at least 5 hours per week in September\n" +
      "and 20 hours per week from October onward .",
    issue: riskDetails["7"],
  },
  {
    riskId: "8",
    level: "medium",
    start: 2565,
    end: 2736,
    text:
      "After reading the message, \n" +
      "they must call the Client on the same day to schedule the first lesson, and then \n" +
      "inform the Principal about the arranged date on the same day.",
    issue: riskDetails["8"],
  },
  {
    riskId: "9",
    level: "medium",
    start: 3494,
    end: 3666,
    text:
      "If the Contractor cannot attend a scheduled lesson, they must immediately\n" +
      "inform both the Client and the Principal. This must be done every time the\n" +
      "Contractor is absent.",
    issue: riskDetails["9"],
  },
  {
    riskId: "10",
    level: "medium",
    start: 4837,
    end: 4949,
    text:
      "If the Contractor does not submit attendance lists and the monthly summary on\n" +
      "time, the payment may be delayed.",
    issue: riskDetails["10"],
  },
  {
    riskId: "11",
    level: "medium",
    start: 5087,
    end: 5267,
    text:
      "By notice with a 3-month notice period  as of the end of the calendar month,\n" +
      "subject to the provisions of the Civil \n" +
      "Code.",
    issue: riskDetails["11"],
  },

  // ✅ LOW RISK

  {
    riskId: "12",
    level: "low",
    start: 640,
    end: 787,
    text:
      "The Contractor accepts the assignment and undertakes to perform the entrusted\n" +
      "tasks with due diligence and in accordance with professional ethics.",
    issue: riskDetails["12"],
  },
  {
    riskId: "13",
    level: "low",
    start: 3396,
    end: 3488,
    text:
      "In case of frequent cancellations by the student, the Contractor must inform the\n" +
      "Principal.",
    issue: riskDetails["13"],
  },
  {
    riskId: "14",
    level: "low",
    start: 4552,
    end: 4835,
    text:
      "The payment date is considered the day the Principal’s account is debited, i.e.,\n" +
      "the 10th day of the month  following the month in which the lessons were\n" +
      "conducted. If this falls on a\n" +
      "non -working day, the payment is made on\n" +
      "the next working day.\n" +
      "5",
    issue: riskDetails["14"],
  },
];

/* -----------------------------------------
   Component
------------------------------------------ */

export function DocumentViewer() {
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [documentText, setDocumentText] = useState<string>("");
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<IssueDetail | null>(null);

  // --- SCAN ANIMATION STATE ---
  const [scanning, setScanning] = useState(false);
  const [activeHighlightIds, setActiveHighlightIds] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const scannerAnimation = useAnimation();
  const scanDuration = 3; // seconds

  /* -----------------------------------------
     Helpers
  ------------------------------------------ */

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case "high":
        return "bg-[#FF3B3B]/55";
      case "medium":
        return "bg-[#FFB547]/50";
      case "low":
        return "bg-[#FFF86A]/55";
      default:
        return "bg-gray-500/55";
    }
  };

  const getBadgeColor = (level: RiskLevel) => {
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

  /* -----------------------------------------
     Load latest contract analysis from backend
  ------------------------------------------ */

  useEffect(() => {
    const loadLatestAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Get list of contracts
        const listRes = await fetch(`${API_BASE_URL}/api/contracts`);
        if (!listRes.ok) {
          throw new Error(`List request failed with status ${listRes.status}`);
        }
        const listJson: ContractListResponse = await listRes.json();

        if (!listJson.items || listJson.items.length === 0) {
          setAnalysis(null);
          setDocumentText("");
          setHighlights([]);
          setSelectedIssue(null);
          return;
        }

        const latest = listJson.items[listJson.items.length - 1];

        // 2) Load full analysis for the latest contract
        const detailRes = await fetch(
          `${API_BASE_URL}/api/contracts/${latest.contractId}`
        );
        if (!detailRes.ok) {
          throw new Error(
            `Detail request failed with status ${detailRes.status}`
          );
        }
        const detailJson: ContractAnalysis = await detailRes.json();
        setAnalysis(detailJson);

        // Build one big text blob from sections
        const sections = detailJson.document?.sections ?? [];
        let combined = "";
        const sectionOffsets: number[] = [];

        sections.forEach((s, idx) => {
          sectionOffsets[idx] = combined.length;
          combined += s.text ?? "";
          if (idx < sections.length - 1) {
            combined += "\n\n";
          }
        });

        setDocumentText(combined);
        setDocumentText(hardCodedText); // TEMPORARY OVERRIDE FOR DEMO

        // Build highlights from issues using snippet positions
        const newHighlights: Highlight[] = [];
        sections.forEach((section, sectionIndex) => {
          const baseOffset = sectionOffsets[sectionIndex] ?? 0;
          const sectionText = section.text ?? "";

          section.issues?.forEach((issue) => {
            if (!issue.snippet) return;
            const localIndex = sectionText.indexOf(issue.snippet);
            if (localIndex === -1) return;

            const start = baseOffset + localIndex;
            const end = start + issue.snippet.length;

            newHighlights.push({
              start,
              end,
              level: issue.severity,
              text: issue.snippet,
              riskId: issue.id,
              issue,
            });
          });
        });

        setHighlights(newHighlights);
        setHighlights(hardCodeHighlights);
        setSelectedIssue(newHighlights[0]?.issue ?? null);
        setActiveHighlightIds([]); // reset active highlights for new doc
      } catch (e) {
        console.error(e);
        setError("Failed to load document analysis from backend.");
        setAnalysis(null);
        setDocumentText("");
        setHighlights([]);
        setSelectedIssue(null);
      } finally {
        setLoading(false);
      }
    };

    loadLatestAnalysis();
  }, []);

  /* -----------------------------------------
     Scanner animation (one forward pass)
  ------------------------------------------ */

  useEffect(() => {
    const startScan = async () => {
      if (!containerRef.current) return;

      setScanning(true);
      setActiveHighlightIds([]);

      const width = containerRef.current.offsetWidth;

      await scannerAnimation.start({
        x: width,
        transition: { duration: scanDuration, ease: "linear" },
      });

      setScanning(false);
    };

    if (documentText) {
      // rerun scan whenever we load a document
      scannerAnimation.set({ x: "-90%" });
      startScan();
    }
  }, [documentText, scannerAnimation]);

  /* -----------------------------------------
     Live highlight activation during scan
  ------------------------------------------ */

  useEffect(() => {
    if (!scanning || !scannerRef.current || !contentRef.current) return;

    let frameId: number;

    const tick = () => {
      if (!scannerRef.current || !contentRef.current) return;

      const scannerRect = scannerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const scannerRightEdge = scannerRect.right - contentRect.left;

      const newActive: string[] = [];

      highlights.forEach((h) => {
        const el = contentRef.current!.querySelector<HTMLSpanElement>(
          `[data-highlight-id="${h.riskId}"]`
        );
        if (!el) return;

        const elRect = el.getBoundingClientRect();
        const elCenter = (elRect.left + elRect.right) / 2 - contentRect.left;

        if (elCenter <= scannerRightEdge) {
          newActive.push(h.riskId);
        }
      });

      setActiveHighlightIds((prev) =>
        prev.length === newActive.length &&
        prev.every((id) => newActive.includes(id))
          ? prev
          : newActive
      );

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [scanning, highlights]);

  /* -----------------------------------------
     Render document with highlight spans
  ------------------------------------------ */

  const renderDocumentWithHighlights = () => {
    if (!documentText) return null;

    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

    sortedHighlights.forEach((highlight, index) => {
      if (highlight.start > lastIndex) {
        parts.push(
          <span key={`text-${index}`} className="text-[#D4D4DD]">
            {documentText.substring(lastIndex, highlight.start)}
          </span>
        );
      }

      const isActive = activeHighlightIds.includes(highlight.riskId);

      parts.push(
        <span
          key={`highlight-${index}`}
          data-highlight-id={highlight.riskId}
          className={cn(
            "cursor-pointer px-1 rounded-sm transition-all duration-200",
            !isActive && "text-[#D4D4DD]",
            isActive &&
              cn(
                getRiskColor(highlight.level),
                "text-[#FFF9F9] shadow-[0_0_2px_rgba(255,50,60,0.8)] border",
                `border-[#FF3B3B]/50`
              )
          )}
          onClick={() => setSelectedIssue(highlight.issue)}
        >
          {highlight.text}
        </span>
      );

      lastIndex = highlight.end;
    });

    if (lastIndex < documentText.length) {
      parts.push(
        <span key="text-final" className="text-[#D4D4DD]">
          {documentText.substring(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  /* -----------------------------------------
     UI states
  ------------------------------------------ */

  if (loading) {
    return (
      <div className="container mx-auto py-4">
        <p className="text-sm text-[#9A9AA2]">Loading document viewer…</p>
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

  if (!analysis || !documentText) {
    return (
      <div className="container mx-auto py-4">
        <p className="text-sm text-[#9A9AA2]">
          No analyzed contracts found. Upload and analyze a document first.
        </p>
      </div>
    );
  }

  /* -----------------------------------------
     Main layout
  ------------------------------------------ */

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* LEFT PANEL – DOCUMENT + SCANNER */}
      <div className="lg:col-span-2">
        <Card className="h-[800px] border-gray-800 bg-[#1a1a1a]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">
                {analysis.document?.title || analysis.fileName}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded bg-[#FF3B3B]" />
                <span className="text-gray-400">High</span>
                <div className="ml-3 h-3 w-3 rounded bg-[#FFB547]" />
                <span className="text-gray-400">Medium</span>
                <div className="ml-3 h-3 w-3 rounded bg-[#FFF86A]" />
                <span className="text-gray-400">Low</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <ScrollArea className="h-[680px] pr-4">
              <div
                ref={containerRef}
                className="relative overflow-hidden rounded-lg border border-gray-800 bg-[#050509] p-6"
              >
                {/* Contract text */}
                <div ref={contentRef}>
                  <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                    {renderDocumentWithHighlights()}
                  </pre>
                </div>

                {/* Scanner overlay */}
                <motion.div
                  ref={scannerRef}
                  className="pointer-events-none absolute -top-8 left-0 h-[calc(100%+64px)]"
                  initial={{ x: "-90%" }}
                  animate={scannerAnimation}
                >
                  <div className="flex h-full flex-row-reverse">
                    <div className="h-full w-[6px] bg-gradient-to-b from-[#FF6666] via-[#FF2D2D] to-transparent shadow-[0_0_24px_rgba(255,45,45,0.9)]" />
                    {/* tail gradient – implemented via custom CSS class */}
                    <div className="scan-gradient-bar h-full w-24" />
                  </div>
                </motion.div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT PANEL – RISK DETAILS */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6 border-gray-800 bg-[#1a1a1a]">
          <CardHeader>
            <CardTitle className="text-white">Risk Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedIssue ? (
              <div className="space-y-6">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-[#EE0000]" />
                    <Badge className={getBadgeColor(selectedIssue.severity)}>
                      {selectedIssue.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <h3 className="mb-2 text-white">
                    {selectedIssue.type || "Issue"}
                  </h3>
                  <p className="text-sm text-gray-400">Clause Risk</p>
                </div>

                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-white">
                    <ChevronRight className="h-4 w-4 text-[#EE0000]" />
                    Explanation
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-300">
                    {selectedIssue.explanation}
                  </p>
                </div>

                {selectedIssue.suggestedFix && (
                  <div className="rounded-lg border border-gray-800 bg-[#0f0f0f] p-4">
                    <h4 className="mb-2 flex items-center gap-2 text-white">
                      <Lightbulb className="h-4 w-4 text-[#F59E0B]" />
                      Suggested Fix
                    </h4>
                    <p className="mb-4 text-sm leading-relaxed text-gray-300">
                      {selectedIssue.suggestedFix}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center">
                <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-gray-600" />
                <p className="text-gray-400">
                  Click on a highlighted section to view risk details
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
