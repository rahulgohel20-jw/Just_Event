import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // TODO: confirm route param name / router setup
import { getbyiduser } from "@/services/apiServices"; // TODO: confirm actual "get member by id" API name
import { showApiError } from "@/utils/swalHelpers";
import { ContentLoader } from "@/components/loaders/ContentLoader";

const MemberDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState("details"); // "details" | "interactions"

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await getbyiduser(id);
        const data = res?.data?.data ?? res?.data ?? null;
        if (!cancelled) setMember(data);
      } catch (err) {
        showApiError(err, { title: "Failed to load member" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="relative min-h-[400px]">
        <ContentLoader />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="p-10 text-center text-sm text-gray-400">Member not found.</div>
    );
  }

  const fullName = `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim();
  const basic = member.userBasicDetails ?? {};
  const isApproved = Boolean(member.isApproved); // TODO: confirm actual field name for approval status
  const remainingAmount = member.remainingAmount ?? 0; // TODO: confirm field
  const remainingPct = member.remainingPercent ?? 0; // TODO: confirm field

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        {/* LEFT: profile card */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <Badge className="bg-blue-900 text-white">Member Info</Badge>
            <Badge className={isApproved ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
              {isApproved ? "Approved" : "Not Approved"}
            </Badge>
            <Badge className="bg-green-700 text-white">{member.userCode ?? "-"}</Badge>
          </div>

          <div className="flex flex-col items-center text-center mb-5">
            <div className="relative">
              <div className="h-20 w-20 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden bg-white">
                {member.profileImage ? (
                  <img src={member.profileImage} alt={fullName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-blue-900">
                    {fullName.slice(0, 2).toUpperCase() || "NA"}
                  </span>
                )}
              </div>
              {member.memberType && ( // TODO: confirm field for the small badge on avatar ("DEFAULT" in mock)
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-gray-900 px-2 py-0.5 text-[9px] font-semibold text-white whitespace-nowrap">
                  {member.memberType}
                </span>
              )}
            </div>

            <h2 className="mt-4 text-base font-semibold text-gray-900">{fullName || "-"}</h2>

            {member.careTag && ( // TODO: confirm field for "Handle with care" pill
              <span className="mt-1 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                {member.careTag}
              </span>
            )}

            {member.stage && ( // TODO: confirm field for "Onboarding" pill
              <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {member.stage}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              type="button"
              onClick={() => setActiveSubTab("details")}
              className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                activeSubTab === "details"
                  ? "bg-blue-900 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              Member Details
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("interactions")}
              className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                activeSubTab === "interactions"
                  ? "bg-blue-900 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              Member Interactions
            </button>
          </div>

          {activeSubTab === "details" && (
            <div className="grid grid-cols-2 gap-3">
              <InfoTile label="User Code" value={member.userCode} strong />
              <InfoTile label="Registration" value={member.createdAt} strong />
              <InfoTile label="Mobile No" value={member.contactNo} strong />
              <InfoTile label="Email" value={member.email} strong truncate />
              <InfoTile label="Member Type" value={member.careTag} strong />
              <InfoTile label="Price" value={member.price != null ? `₹${member.price}` : "-"} strong />
              <InfoTile label="Plan" value={basic?.role?.nameEnglish} strong />
              <InfoTile label="Status" value={member.isActive ? "Active" : "Inactive"} strong />
            </div>
          )}

          {activeSubTab === "interactions" && (
            <div className="py-8 text-center text-sm text-gray-400">
              {/* TODO: wire real interactions list/API */}
              No interactions to show.
            </div>
          )}
        </div>

        {/* RIGHT: detail panels */}
        <div className="space-y-6">
          {/* header bar */}
          <div className="rounded-xl bg-blue-900 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 text-white">
              <span className="font-semibold">{fullName} -</span>
              <span className="rounded-full bg-green-50/90 px-3 py-1 text-xs font-medium text-green-700">
                Remaining amount: ₹{remainingAmount} ({remainingPct}%)
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/members/${id}/edit`)} // TODO: confirm edit route
              className="rounded-lg bg-white px-4 py-1.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Edit
            </button>
          </div>

          {/* Personal information */}
          <Section title="Personal Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              <Field label="Address" value={member.address} />
              <Field label="State ID" value={member.stateName} highlight />
              <Field label="Created At" value={member.createdAt} highlight />
              <Field label="Mobile No" value={member.contactNo} highlight />
              <Field label="Company Name" value={basic.companyName} />
              <Field label="Company Email" value={member.companyEmail} highlight />
              <Field label="Office No" value={member.officeNo} highlight />
              <Field label="Reporting Manager ID" value={member.reportingManagerId} />
            </div>
          </Section>

          {/* KYC */}
          <Section title="KYC Details">
            {member.kycDocuments?.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {member.kycDocuments.map((doc, i) => (
                  <a
                    key={i}
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-blue-700 hover:bg-gray-50 truncate"
                  >
                    {doc.name ?? `Document ${i + 1}`}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No KYC documents available</p>
            )}
          </Section>

          {/* Payment details */}
          <Section title={`Payment details | Pending Amount: ₹${member.pendingAmount ?? 0}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              <Field label="Plan Name" value={basic?.role?.nameEnglish} />
              <Field label="Plan Price" value={member.price != null ? `₹${member.price}` : "-"} />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

const Badge = ({ children, className = "" }) => (
  <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${className}`}>{children}</span>
);

const InfoTile = ({ label, value, strong, truncate }) => (
  <div className="rounded-lg border border-gray-200 px-3 py-2">
    <p className="text-[11px] text-gray-400">{label}</p>
    <p className={`text-sm ${strong ? "font-semibold text-gray-900" : "text-gray-600"} ${truncate ? "truncate" : ""}`}>
      {value ?? "-"}
    </p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
    <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-900">
      <span className="h-2 w-2 rounded-full bg-blue-900" />
      {title}
    </h3>
    {children}
  </div>
);

const Field = ({ label, value, highlight }) => (
  <div>
    <p className="text-sm font-medium text-gray-800">{label}:</p>
    <p className={`text-sm ${highlight ? "text-blue-700" : "text-gray-500"}`}>{value ?? "N/A"}</p>
  </div>
);

export default MemberDetailPage;