import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ── Helpers ──────────────────────────────────────────────────────────────────
const getUser = () => JSON.parse(localStorage.getItem("loggedInUser")) || {};
const getSavedExtra = (studentId) =>
  JSON.parse(localStorage.getItem("profile_extra_" + studentId)) || {};
const getPhotoSafe = (key) => {
  try { return localStorage.getItem(key) || null; } catch { return null; }
};
const savePhotoSafe = (key, data) => {
  try { localStorage.setItem(key, data); return true; }
  catch (e) { return false; }
};

export default function StudentProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(getUser);
  const elections = JSON.parse(localStorage.getItem("elections")) || [];
  const savedExtra = getSavedExtra(user?.studentId);

  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    name:        user?.name        || "",
    email:       user?.email       || "",
    phone:       savedExtra.phone       || "",
    department:  savedExtra.department  || "",
    semester:    savedExtra.semester    || "",
    batch:       savedExtra.batch       || "",
    passingYear: savedExtra.passingYear || "",
    program:     savedExtra.program     || "",
    gender:      savedExtra.gender      || "",
    dob:         savedExtra.dob         || "",
    address:     savedExtra.address     || "",
    bio:         savedExtra.bio         || "",
  });

  const [profilePhoto, setProfilePhoto] = useState(
    () => getPhotoSafe("photo_profile_" + user?.studentId)
  );
  const [coverPhoto, setCoverPhoto] = useState(
    () => getPhotoSafe("photo_cover_" + user?.studentId)
  );
  const [photoError, setPhotoError] = useState("");
  const [lightbox, setLightbox] = useState(null);

  const profilePhotoRef = useRef();
  const coverPhotoRef   = useRef();

  const votedElections = elections.filter((e) =>
    localStorage.getItem("vote_" + user?.studentId + "_" + e.id)
  );

  const initials = (form.name || "ST")
    .split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Handle Photo Upload ──────────────────────────────────────────────────
  const handlePhotoUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Image too large. Please use an image under 2MB.");
      return;
    }
    setPhotoError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      const data = reader.result;
      const key = type === "profile"
        ? "photo_profile_" + user?.studentId
        : "photo_cover_"   + user?.studentId;

      const ok = savePhotoSafe(key, data);
      if (!ok) {
        setPhotoError("Storage full. Try a smaller image.");
        return;
      }
      if (type === "profile") setProfilePhoto(data);
      else                    setCoverPhoto(data);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ── Handle Photo Remove ──────────────────────────────────────────────────
  const handlePhotoRemove = (type) => {
    const key = type === "profile"
      ? "photo_profile_" + user?.studentId
      : "photo_cover_"   + user?.studentId;
    localStorage.removeItem(key);
    if (type === "profile") setProfilePhoto(null);
    else                    setCoverPhoto(null);
    showToast(`${type === "profile" ? "Profile" : "Cover"} photo removed.`);
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = () => {
    try {
      const updatedUser = { ...user, name: form.name, email: form.email };
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = users.map((u) =>
        u.studentId === user.studentId
          ? { ...u, name: form.name, email: form.email }
          : u
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      const extra = {
        phone:       form.phone,
        department:  form.department,
        semester:    form.semester,
        batch:       form.batch,
        passingYear: form.passingYear,
        program:     form.program,
        gender:      form.gender,
        dob:         form.dob,
        address:     form.address,
        bio:         form.bio,
      };
      localStorage.setItem("profile_extra_" + user.studentId, JSON.stringify(extra));

      setUser(updatedUser);
      setEditing(false);
      showToast("Profile saved successfully!");
    } catch (err) {
      showToast("Failed to save. Storage may be full.", "error");
    }
  };

  const handleCancel = () => setEditing(false);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  // ── Profile Completion ────────────────────────────────────────────────────
  const completionFields = [
    form.phone, form.department, form.semester, form.batch,
    form.passingYear, form.program, form.gender, form.dob,
    form.bio, profilePhoto,
  ];
  const completionPct = Math.round(
    (completionFields.filter(Boolean).length / completionFields.length) * 100
  );

  const semesters    = ["1st","2nd","3rd","4th","5th","6th","7th","8th"];
  const programs     = ["B.Tech","B.Sc","B.Com","BBA","BCA","M.Tech","M.Sc","MBA","MCA","PhD"];
  const currentYear  = new Date().getFullYear();
  const passingYears = Array.from({ length: 8 }, (_, i) => currentYear + i - 2);

  const EditActions = () => editing ? (
    <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-slate-700 mt-4">
      <button
        onClick={handleCancel}
        className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition"
      >
        Cancel
      </button>
      <button
        onClick={handleSave}
        className="flex-[2] py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 active:scale-95 text-white font-semibold text-sm transition shadow-md shadow-blue-900/20"
      >
        Save Changes
      </button>
    </div>
  ) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-10">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all
          ${toast.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}
        >
          {toast.type === "error"
            ? <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            : <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          }
          {toast.msg}
        </div>
      )}

      {/* ── Cover + Profile Photo ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">

        {/* Cover — dynamic height: min 120px, grows with content via aspect ratio when photo present */}
        <div
          className={`relative w-full bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 dark:from-[#0b132b] dark:to-[#1c2541] ${coverPhoto ? "" : "h-36"}`}
          style={coverPhoto ? { aspectRatio: "3 / 1", minHeight: "120px" } : {}}
        >
          {coverPhoto && (
            <img
              src={coverPhoto}
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
              onClick={() => setLightbox("cover")}
              title="Click to zoom"
            />
          )}

          {/* Cover photo action buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            {coverPhoto && (
              <button
                onClick={() => handlePhotoRemove("cover")}
                className="flex items-center gap-1.5 bg-black/50 hover:bg-red-600/80 text-white text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm transition"
                title="Remove cover photo"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Remove
              </button>
            )}
            <button
              onClick={() => coverPhotoRef.current.click()}
              className="flex items-center gap-1.5 bg-black/40 hover:bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {coverPhoto ? "Change Cover" : "Add Cover"}
            </button>
          </div>

          <input ref={coverPhotoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, "cover")} />
        </div>

        {/* Avatar + buttons */}
        <div className="px-6 pb-5">
          <div className="flex items-end justify-between -mt-12 mb-4">
            {/* Avatar */}
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-blue-700 flex items-center justify-center shadow-md cursor-zoom-in"
                onClick={() => setLightbox("profile")}
                title="Click to zoom"
              >
                {profilePhoto
                  ? <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  : <span className="text-white font-bold text-3xl">{initials}</span>
                }
              </div>

              {/* Profile photo action: change button always visible */}
              <button
                onClick={() => profilePhotoRef.current.click()}
                className="absolute bottom-1 right-1 w-7 h-7 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center shadow border-2 border-white dark:border-slate-900 transition"
                title={profilePhoto ? "Change profile photo" : "Add profile photo"}
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </button>

              <input ref={profilePhotoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, "profile")} />
            </div>

            {/* Edit / Save / Cancel + Remove Profile Photo */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-1.5 rounded-xl bg-blue-800 hover:bg-blue-900 active:scale-95 text-white text-sm font-semibold transition shadow-md"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
                  >
                    <svg className="w-4 h-4 " fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Remove profile photo button — only shown when photo exists */}
              {profilePhoto && (
                <button
                  onClick={() => handlePhotoRemove("profile")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 dark:hover:text-red-400 transition"
                  title="Remove profile photo"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  Remove photo
                </button>
              )}
            </div>
          </div>

          {/* Photo error */}
          {photoError && (
            <p className="text-xs text-red-500 font-semibold mb-2 -mt-2">{photoError}</p>
          )}

          {/* Name / tags */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{form.name || user?.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{form.email}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.program    && <Tag color="blue">{form.program}</Tag>}
              {form.department && <Tag color="purple">{form.department}</Tag>}
              {form.semester   && <Tag color="green">{form.semester} Semester</Tag>}
              {form.batch      && <Tag color="orange">Batch {form.batch}</Tag>}
            </div>
            {form.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">{form.bio}</p>
            )}
          </div>

          {/* Completion bar — hidden when 100% */}
          {completionPct < 100 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                <span>Profile Completion</span>
                <span className="text-blue-600">{completionPct}%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 bg-blue-600"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Fill in all fields to reach 100% — click <strong>Edit Profile</strong> to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-1">
        {[
          { key: "info",     label: "Personal Info" },
          { key: "academic", label: "Academic Details" },
          { key: "activity", label: "Voting Activity" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
              ${activeTab === t.key
                ? "bg-blue-800 text-white shadow"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Personal Info Tab ── */}
      {activeTab === "info" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Personal Information</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name"      name="name"    value={form.name}    editing={editing} onChange={handleChange} placeholder="Your full name" />
            <Field label="Email Address"  name="email"   value={form.email}   editing={editing} onChange={handleChange} type="email" placeholder="you@email.com" />
            <Field label="Phone Number"   name="phone"   value={form.phone}   editing={editing} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
            <SelectField
              label="Gender" name="gender" value={form.gender}
              editing={editing} onChange={handleChange}
              options={["Male","Female","Other","Prefer not to say"]}
              placeholder="Select gender"
            />
            <Field label="Date of Birth"  name="dob"     value={form.dob}     editing={editing} onChange={handleChange} type="date" />
            <Field label="Address / City" name="address" value={form.address} editing={editing} onChange={handleChange} placeholder="City, State" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Bio</label>
            {editing
              ? <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} placeholder="Tell us something about yourself..." className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition resize-none" />
              : <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{form.bio || <span className="text-gray-400">Not set</span>}</p>
            }
          </div>

          <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Student ID</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{user?.studentId}</p>
            </div>
            <span className="text-xs text-gray-400 bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded-lg">Read Only</span>
          </div>

          <EditActions />
        </div>
      )}

      {/* ── Academic Details Tab ── */}
      {activeTab === "academic" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Academic Details</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <SelectField
              label="Program / Degree" name="program" value={form.program}
              editing={editing} onChange={handleChange}
              options={programs} placeholder="Select program"
            />
            <Field label="Department / Branch" name="department" value={form.department} editing={editing} onChange={handleChange} placeholder="e.g. Computer Science" />
            <SelectField
              label="Current Semester" name="semester" value={form.semester}
              editing={editing} onChange={handleChange}
              options={semesters} placeholder="Select semester"
            />
            <Field label="Batch / Admission Year" name="batch" value={form.batch} editing={editing} onChange={handleChange} placeholder="e.g. 2022" type="number" />
            <SelectField
              label="Expected Passing Year" name="passingYear" value={form.passingYear}
              editing={editing} onChange={handleChange}
              options={passingYears.map(String)} placeholder="Select year"
            />
            <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3 self-end">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Student ID</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{user?.studentId}</p>
              </div>
              <span className="text-xs text-gray-400 bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded-lg">Read Only</span>
            </div>
          </div>

          {!editing && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {[
                { label: "Program",       value: form.program,                  color: "blue"   },
                { label: "Department",    value: form.department,               color: "purple" },
                { label: "Semester",      value: form.semester ? `${form.semester} Sem` : "", color: "green"  },
                { label: "Batch",         value: form.batch,                    color: "orange" },
                { label: "Passing Year",  value: form.passingYear,              color: "red"    },
              ].filter((i) => i.value).map((item, i) => (
                <SummaryCard key={i} label={item.label} value={item.value} color={item.color} />
              ))}
            </div>
          )}

          <EditActions />
        </div>
      )}

      {/* ── Voting Activity Tab ── */}
      {activeTab === "activity" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Elections", value: elections.length,       color: "blue"   },
              { label: "Votes Cast",      value: votedElections.length,  color: "green"  },
              { label: "Participation",   value: elections.length > 0 ? `${Math.round((votedElections.length / elections.length) * 100)}%` : "0%", color: "purple" },
            ].map((s, i) => (
              <SummaryCard key={i} label={s.label} value={s.value} color={s.color} center />
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Voting History</h3>
            {votedElections.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">You haven't voted in any elections yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {votedElections.map((e) => {
                  const votedFor = localStorage.getItem("vote_" + user.studentId + "_" + e.id);
                  const isEnded  = new Date() > new Date(e.endTime);
                  return (
                    <div key={e.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{e.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Voted for: <span className="font-semibold text-blue-700 dark:text-blue-400">{votedFor}</span>
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0
                        ${isEnded
                          ? "bg-gray-100 dark:bg-slate-700 text-gray-500"
                          : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"}`}>
                        {isEnded ? "Ended" : "Live"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Lightbox Modal ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white flex items-center gap-1.5 text-sm font-semibold transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Close
            </button>

            {lightbox === "cover" && (
              coverPhoto
                ? <img src={coverPhoto} alt="Cover" className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl" />
                : <div className="w-full h-64 rounded-2xl bg-gradient-to-br from-blue-900 to-blue-500 flex items-center justify-center">
                    <p className="text-white/60 text-sm">No cover photo uploaded</p>
                  </div>
            )}

            {lightbox === "profile" && (
              profilePhoto
                ? <img src={profilePhoto} alt="Profile" className="w-72 h-72 object-cover rounded-full shadow-2xl mx-auto border-4 border-white/20" />
                : <div className="w-72 h-72 rounded-full bg-blue-700 flex items-center justify-center mx-auto border-4 border-white/20 shadow-2xl">
                    <span className="text-white font-bold text-7xl">{initials}</span>
                  </div>
            )}

            <p className="text-center text-white/50 text-xs mt-4">Click anywhere outside to close</p>
          </div>
        </div>
      )}

      {/* ── Logout ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-1">Account</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Signed in as <span className="font-semibold">{user?.email}</span>
        </p>
        <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 font-semibold text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}

// ── Reusable Components ───────────────────────────────────────────────────────

function Field({ label, name, value, editing, onChange, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {editing ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition"
        />
      ) : (
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 py-1">
          {value || <span className="text-gray-400 font-normal italic">Not set</span>}
        </p>
      )}
    </div>
  );
}

function SelectField({ label, name, value, editing, onChange, options, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {editing ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 py-1">
          {value || <span className="text-gray-400 font-normal italic">Not set</span>}
        </p>
      )}
    </div>
  );
}

function Tag({ color, children }) {
  const colors = {
    blue:   "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
    green:  "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
}

function SummaryCard({ label, value, color, center = false }) {
  const colors = {
    blue:   "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-400",
    purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800 text-purple-700 dark:text-purple-400",
    green:  "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800 text-green-700 dark:text-green-400",
    orange: "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800 text-orange-700 dark:text-orange-400",
    red:    "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-700 dark:text-red-400",
  };
  return (
    <div className={`rounded-xl p-3 border ${center ? "text-center" : ""} ${colors[color] || colors.blue}`}>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      <p className={`text-sm font-bold mt-0.5 ${colors[color].split(" ").slice(-2).join(" ")}`}>{value}</p>
    </div>
  );
}
