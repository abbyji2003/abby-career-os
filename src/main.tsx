import React from "react";
import ReactDOM from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  CirclePlay,
  Clock3,
  Code2,
  Download,
  ExternalLink,
  Flame,
  GraduationCap,
  Home,
  Moon,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Square,
  Sun,
  Target,
  TimerReset,
} from "lucide-react";
import { registerServiceWorker } from "./pwa";
import "./styles.css";

registerServiceWorker();

type Tab = "Dashboard" | "Learning" | "Projects" | "Jobs" | "Review";
type JobStatus = "Saved" | "Applied" | "Interview" | "Rejected" | "Offer";
type ProjectStage = "Idea" | "Planning" | "Development" | "Testing" | "Portfolio Ready";

type Course = {
  name: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  todayGoal: number;
  weeklyMinutes: number;
  resource: string;
  weeklyPlan: WeeklyPlan[];
};

type WeeklyPlan = {
  week: number;
  focus: string;
  tasks: { label: string; done: boolean }[];
};

type Project = {
  name: string;
  stage: ProjectStage;
  checklist: { label: string; done: boolean }[];
  notes: string;
  github: string;
};

type Job = {
  id: string;
  company: string;
  role: string;
  category: string;
  dateAdded: string;
  status: JobStatus;
};

type ReviewEntry = {
  id: string;
  weekOf: string;
  finished: string;
  focus: string;
};

type StudySession = {
  id: string;
  course: string;
  minutes: number;
  date: string;
};

type AppState = {
  courses: Course[];
  projects: Project[];
  jobs: Job[];
  reviews: ReviewEntry[];
  studySessions: StudySession[];
  streak: number;
  lastStudyDate: string | null;
  darkMode: boolean;
};

const storageKey = "abby-career-os-v2";
const graduationDate = new Date("2027-08-15T00:00:00");
const stages: ProjectStage[] = ["Idea", "Planning", "Development", "Testing", "Portfolio Ready"];
const statuses: JobStatus[] = ["Saved", "Applied", "Interview", "Rejected", "Offer"];

const todayKey = () => new Date().toISOString().slice(0, 10);
const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};
const dateKey = (date: Date) => date.toISOString().slice(0, 10);
const plan = (items: { focus: string; tasks: string[] }[]): WeeklyPlan[] =>
  items.map((item, index) => ({
    week: index + 1,
    focus: item.focus,
    tasks: item.tasks.map((label) => ({ label, done: false })),
  }));

const courseTemplates: Course[] = [
  {
    name: "SQL",
    progress: 0,
    lessonsCompleted: 0,
    totalLessons: 24,
    todayGoal: 25,
    weeklyMinutes: 0,
    resource: "https://sqlbolt.com",
    weeklyPlan: plan([
      { focus: "Query foundations", tasks: ["SELECT, WHERE, ORDER BY", "Practice filtering clinical tables", "Write 10 nutrition-dataset queries"] },
      { focus: "Aggregation", tasks: ["COUNT, AVG, GROUP BY", "Summarize labs by patient group", "Create saved query notes"] },
      { focus: "Joins", tasks: ["INNER and LEFT JOIN", "Join demographics, labs, and diet tables", "Explain join errors in notes"] },
      { focus: "Clinical cohort logic", tasks: ["CASE WHEN", "Build diabetes-risk feature flags", "Validate missing values"] },
      { focus: "Analytics queries", tasks: ["Window functions", "Rank risk groups", "Create portfolio query snippets"] },
      { focus: "Portfolio SQL", tasks: ["Clean final SQL file", "Write README explanation", "Connect SQL to NHANES project"] },
    ]),
  },
  {
    name: "Python",
    progress: 0,
    lessonsCompleted: 0,
    totalLessons: 24,
    todayGoal: 30,
    weeklyMinutes: 0,
    resource: "https://www.py4e.com",
    weeklyPlan: plan([
      { focus: "Python basics", tasks: ["Variables, types, functions", "Loops and conditionals", "Build a BMI category helper"] },
      { focus: "Files and modules", tasks: ["Read CSV files", "Write reusable functions", "Organize project notebooks"] },
      { focus: "Data cleaning logic", tasks: ["Handle missing values", "Create validation checks", "Document assumptions"] },
      { focus: "Clinical workflow scripts", tasks: ["Parse diet-order examples", "Map orders to rules", "Generate reconciliation output"] },
      { focus: "APIs and automation", tasks: ["Use requests basics", "Save structured JSON", "Draft automation ideas"] },
      { focus: "Portfolio polish", tasks: ["Refactor one script", "Add docstrings", "Commit Python project milestone"] },
    ]),
  },
  {
    name: "Pandas",
    progress: 0,
    lessonsCompleted: 0,
    totalLessons: 20,
    todayGoal: 25,
    weeklyMinutes: 0,
    resource: "https://www.kaggle.com/learn/pandas",
    weeklyPlan: plan([
      { focus: "DataFrame fluency", tasks: ["Select columns and rows", "Filter patient records", "Create a data dictionary"] },
      { focus: "Cleaning healthcare data", tasks: ["Missingness patterns", "Type conversion", "Outlier checks"] },
      { focus: "Feature engineering", tasks: ["Nutrition features", "Lab threshold flags", "Risk score inputs"] },
      { focus: "Group analysis", tasks: ["Groupby summaries", "Compare cohorts", "Export clean tables"] },
      { focus: "Visualization prep", tasks: ["Create chart-ready tables", "Summarize distributions", "Write interpretation notes"] },
      { focus: "Project integration", tasks: ["Prepare NHANES dataset", "Save reproducible notebook", "Link output to dashboard"] },
    ]),
  },
  {
    name: "Statistics",
    progress: 0,
    lessonsCompleted: 0,
    totalLessons: 20,
    todayGoal: 25,
    weeklyMinutes: 0,
    resource: "https://www.youtube.com/@statquest",
    weeklyPlan: plan([
      { focus: "Descriptive statistics", tasks: ["Mean, median, variance", "Clinical interpretation", "Summarize one biomarker"] },
      { focus: "Probability foundations", tasks: ["Distributions", "Sensitivity and specificity", "Risk language notes"] },
      { focus: "Hypothesis testing", tasks: ["p-values and confidence intervals", "Two-group comparison", "Avoid overclaiming results"] },
      { focus: "Regression basics", tasks: ["Linear regression", "Logistic regression intuition", "Interpret coefficients"] },
      { focus: "Model evaluation", tasks: ["ROC, AUC, confusion matrix", "Precision and recall", "Clinical tradeoff notes"] },
      { focus: "Portfolio statistics", tasks: ["Write methods section", "Create assumptions checklist", "Review one project result"] },
    ]),
  },
  {
    name: "Machine Learning",
    progress: 0,
    lessonsCompleted: 0,
    totalLessons: 24,
    todayGoal: 35,
    weeklyMinutes: 0,
    resource: "https://www.coursera.org/specializations/machine-learning-introduction",
    weeklyPlan: plan([
      { focus: "ML framing", tasks: ["Define prediction target", "Train/test split", "Baseline model mindset"] },
      { focus: "Supervised learning", tasks: ["Logistic regression", "Decision trees", "Compare model behavior"] },
      { focus: "Evaluation", tasks: ["Confusion matrix", "AUC and calibration", "Clinical error analysis"] },
      { focus: "Feature importance", tasks: ["Permutation importance", "SHAP concept notes", "Explain model limitations"] },
      { focus: "Healthcare AI ethics", tasks: ["Bias and missingness", "Fairness checks", "Write risk statement"] },
      { focus: "Portfolio model", tasks: ["Train final baseline", "Create model card", "Add project screenshots"] },
    ]),
  },
];

const initialState: AppState = {
  darkMode: false,
  streak: 0,
  lastStudyDate: null,
  courses: courseTemplates,
  projects: [
    {
      name: "NHANES Diabetes Risk",
      stage: "Idea",
      notes: "Build a cleaned NHANES cohort, engineer nutrition and lab features, and explain risk factors clearly.",
      github: "https://github.com/abby/nhanes-diabetes-risk",
      checklist: [
        { label: "Define cohort", done: false },
        { label: "Clean biomarkers", done: false },
        { label: "Train baseline model", done: false },
        { label: "Add SHAP explanation", done: false },
        { label: "Write portfolio story", done: false },
      ],
    },
    {
      name: "Diet Order Reconciliation Tool",
      stage: "Idea",
      notes: "Map hospital diet orders against nutrition rules and surface workflow mismatches.",
      github: "https://github.com/abby/diet-order-reconciliation",
      checklist: [
        { label: "Workflow map", done: false },
        { label: "Rule library", done: false },
        { label: "Prototype UI", done: false },
        { label: "Test sample orders", done: false },
        { label: "Case study writeup", done: false },
      ],
    },
    {
      name: "Disease Risk Prediction Dashboard",
      stage: "Idea",
      notes: "Interactive clinical analytics dashboard for transparent disease risk monitoring.",
      github: "https://github.com/abby/disease-risk-dashboard",
      checklist: [
        { label: "Pick target disease", done: false },
        { label: "Select dataset", done: false },
        { label: "Design metrics", done: false },
        { label: "Build dashboard", done: false },
        { label: "Publish demo", done: false },
      ],
    },
  ],
  jobs: [],
  reviews: [],
  studySessions: [],
};

function freshInitialState(): AppState {
  return JSON.parse(JSON.stringify(initialState)) as AppState;
}

function normalizeState(stored: Partial<AppState>): AppState {
  const fallback = freshInitialState();
  return {
    ...fallback,
    ...stored,
    courses: fallback.courses.map((template) => {
      const storedCourse = stored.courses?.find((course) => course.name === template.name);
      return storedCourse ? { ...template, ...storedCourse, weeklyPlan: storedCourse.weeklyPlan ?? template.weeklyPlan } : template;
    }),
  };
}

function usePersistentState() {
  const [state, setState] = React.useState<AppState>(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? normalizeState(JSON.parse(stored)) : freshInitialState();
  });

  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", state.darkMode);
  }, [state.darkMode]);

  return [state, setState] as const;
}

function projectProgress(project: Project) {
  return Math.round((project.checklist.filter((item) => item.done).length / project.checklist.length) * 100);
}

function computeStreak(existing: number, lastStudyDate: string | null) {
  const today = todayKey();
  if (lastStudyDate === today) return existing;
  const yesterday = dateKey(addDays(new Date(), -1));
  return lastStudyDate === yesterday ? existing + 1 : 1;
}

function coursePlanProgress(course: Course) {
  const tasks = course.weeklyPlan.flatMap((week) => week.tasks);
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((task) => task.done).length / tasks.length) * 100);
}

function courseTaskTotal(course: Course) {
  return course.weeklyPlan.flatMap((week) => week.tasks).length;
}

function syncCourseProgress(course: Course): Course {
  const completed = course.weeklyPlan.flatMap((week) => week.tasks).filter((task) => task.done).length;
  return {
    ...course,
    lessonsCompleted: completed,
    progress: coursePlanProgress(course),
  };
}

function completeNextWeeklyTask(course: Course): Course {
  let completedOne = false;
  const weeklyPlan = course.weeklyPlan.map((week) => ({
    ...week,
    tasks: week.tasks.map((task) => {
      if (completedOne || task.done) return task;
      completedOne = true;
      return { ...task, done: true };
    }),
  }));
  return syncCourseProgress({ ...course, weeklyPlan });
}

function App() {
  const [state, setState] = usePersistentState();
  const [activeTab, setActiveTab] = React.useState<Tab>("Dashboard");
  const [timerCourse, setTimerCourse] = React.useState<Course | null>(null);

  const updateState = (recipe: (draft: AppState) => AppState) => setState((current) => recipe(current));
  const dailyMinutes = state.studySessions.filter((s) => s.date === todayKey()).reduce((sum, s) => sum + s.minutes, 0);
  const weeklyMinutes = state.studySessions.filter((s) => new Date(s.date) >= addDays(new Date(), -6)).reduce((sum, s) => sum + s.minutes, 0);
  const jobCounts = countByStatus(state.jobs);
  const activeProject = [...state.projects].sort((a, b) => projectProgress(b) - projectProgress(a))[0];

  const finishStudy = (courseName: string, minutes: number) => {
    updateState((current) => ({
      ...current,
      streak: computeStreak(current.streak, current.lastStudyDate),
      lastStudyDate: todayKey(),
      studySessions: [
        ...current.studySessions,
        { id: crypto.randomUUID(), course: courseName, minutes, date: todayKey() },
      ],
      courses: current.courses.map((course) =>
        course.name === courseName
          ? { ...course, weeklyMinutes: course.weeklyMinutes + minutes }
          : course,
      ),
    }));
  };

  const resetAllData = () => {
    if (!window.confirm("Reset Abby Career OS to a clean template?")) return;
    localStorage.removeItem(storageKey);
    setState(freshInitialState());
    setActiveTab("Dashboard");
  };

  const exportData = (format: "json" | "csv") => {
    const payload = format === "json" ? JSON.stringify(state, null, 2) : toCsv(state);
    const blob = new Blob([payload], { type: format === "json" ? "application/json" : "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `abby-career-os.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-ivory text-ink transition-colors dark:bg-ink dark:text-bone">
      <div className="fixed inset-0 texture-bg" />
      <main className="relative mx-auto min-h-screen w-full max-w-[520px] px-4 pb-28 pt-5 sm:px-6">
        <Header
          darkMode={state.darkMode}
          onToggleDark={() => updateState((current) => ({ ...current, darkMode: !current.darkMode }))}
          onExport={exportData}
          onReset={resetAllData}
        />
        <AnimatePresence mode="wait">
          <motion.section
            key={activeTab}
            initial={{ opacity: 0, y: 18, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {activeTab === "Dashboard" && (
              <Dashboard
                state={state}
                dailyMinutes={dailyMinutes}
                weeklyMinutes={weeklyMinutes}
                jobCounts={jobCounts}
                activeProject={activeProject}
              />
            )}
            {activeTab === "Learning" && (
              <Learning
                courses={state.courses}
                onStart={setTimerCourse}
                onCompleteLesson={(name) =>
                  updateState((current) => ({
                    ...current,
                    courses: current.courses.map((course) =>
                      course.name === name ? completeNextWeeklyTask(course) : course,
                    ),
                  }))
                }
                onToggleTask={(courseName, week, label) =>
                  updateState((current) => ({
                    ...current,
                    courses: current.courses.map((course) =>
                      course.name === courseName
                        ? syncCourseProgress({
                            ...course,
                            weeklyPlan: course.weeklyPlan.map((planWeek) =>
                              planWeek.week === week
                                ? {
                                    ...planWeek,
                                    tasks: planWeek.tasks.map((task) =>
                                      task.label === label ? { ...task, done: !task.done } : task,
                                    ),
                                  }
                                : planWeek,
                            ),
                          })
                        : course,
                    ),
                  }))
                }
              />
            )}
            {activeTab === "Projects" && (
              <Projects
                projects={state.projects}
                onToggle={(projectName, itemLabel) =>
                  updateState((current) => ({
                    ...current,
                    projects: current.projects.map((project) =>
                      project.name === projectName
                        ? {
                            ...project,
                            checklist: project.checklist.map((item) =>
                              item.label === itemLabel ? { ...item, done: !item.done } : item,
                            ),
                          }
                        : project,
                    ),
                  }))
                }
                onStage={(projectName, stage) =>
                  updateState((current) => ({
                    ...current,
                    projects: current.projects.map((project) =>
                      project.name === projectName ? { ...project, stage } : project,
                    ),
                  }))
                }
              />
            )}
            {activeTab === "Jobs" && (
              <Jobs
                jobs={state.jobs}
                onAdd={(job) => updateState((current) => ({ ...current, jobs: [job, ...current.jobs] }))}
                onStatus={(id, status) =>
                  updateState((current) => ({
                    ...current,
                    jobs: current.jobs.map((job) => (job.id === id ? { ...job, status } : job)),
                  }))
                }
                counts={jobCounts}
              />
            )}
            {activeTab === "Review" && (
              <Review
                reviews={state.reviews}
                onSave={(entry) => updateState((current) => ({ ...current, reviews: [entry, ...current.reviews] }))}
              />
            )}
          </motion.section>
        </AnimatePresence>
      </main>
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      {timerCourse && <StudyTimer course={timerCourse} onClose={() => setTimerCourse(null)} onFinish={finishStudy} />}
    </div>
  );
}

function Header({ darkMode, onToggleDark, onExport, onReset }: { darkMode: boolean; onToggleDark: () => void; onExport: (format: "json" | "csv") => void; onReset: () => void }) {
  return (
    <header className="mb-5 flex items-center justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-graphite/55 dark:text-bone/55">Career command</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-normal">Abby Career OS</h1>
      </div>
      <div className="flex items-center gap-2">
        <IconButton label="Export JSON" onClick={() => onExport("json")}><Download size={18} /></IconButton>
        <IconButton label="Export CSV" onClick={() => onExport("csv")}><BarChart3 size={18} /></IconButton>
        <IconButton label="Reset data" onClick={onReset}><RotateCcw size={18} /></IconButton>
        <IconButton label="Toggle dark mode" onClick={onToggleDark}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</IconButton>
      </div>
    </header>
  );
}

function Dashboard({ state, dailyMinutes, weeklyMinutes, jobCounts, activeProject }: { state: AppState; dailyMinutes: number; weeklyMinutes: number; jobCounts: Record<JobStatus, number>; activeProject: Project }) {
  const daysRemaining = Math.max(0, Math.ceil((graduationDate.getTime() - Date.now()) / 86400000));
  return (
    <div className="space-y-4">
      <section className="hero-card overflow-hidden rounded-5xl p-6 shadow-glass">
        <div className="relative z-10">
          <div className="mb-12 inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/35 px-3 py-1 text-xs font-medium backdrop-blur dark:border-white/10 dark:bg-white/5">
            <Sparkles size={14} /> Precision career system
          </div>
          <h2 className="max-w-[12rem] text-4xl font-semibold leading-[0.98] tracking-normal">Abby Career OS</h2>
          <p className="mt-3 text-sm text-graphite/70 dark:text-bone/70">Nutrition {"->"} Precision Health {"->"} Healthcare AI</p>
        </div>
      </section>
      <CareerPositioning />
      <div className="grid grid-cols-2 gap-3">
        <Metric icon={<GraduationCap />} label="Graduation" value={daysRemaining.toString()} suffix="days" />
        <Metric icon={<Flame />} label="Learning streak" value={state.streak.toString()} suffix="days" />
        <ProgressCard label="Daily study" value={dailyMinutes} goal={60} />
        <Metric icon={<Code2 />} label="Weekly total" value={weeklyMinutes.toString()} suffix="min" />
      </div>
      <GlassCard>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="section-label">Active Project</p>
            <h3 className="mt-1 text-xl font-semibold">{activeProject.name}</h3>
          </div>
          <div className="rounded-full bg-ink px-3 py-1 text-xs text-bone dark:bg-bone dark:text-ink">{projectProgress(activeProject)}%</div>
        </div>
        <Progress value={projectProgress(activeProject)} />
      </GlassCard>
      <Analytics state={state} jobCounts={jobCounts} />
    </div>
  );
}

function CareerPositioning() {
  const badges = ["Clinical Nutrition", "Hospital Workflow", "Meditech", "Computrition", "Precision Health", "Python", "SQL"];
  return (
    <GlassCard>
      <div className="mb-3 flex items-center gap-2">
        <Target size={18} />
        <h3 className="text-lg font-semibold">Career Positioning</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => <span className="badge" key={badge}>{badge}</span>)}
      </div>
    </GlassCard>
  );
}

function Analytics({ state, jobCounts }: { state: AppState; jobCounts: Record<JobStatus, number> }) {
  const last7 = Array.from({ length: 7 }, (_, index) => {
    const key = dateKey(addDays(new Date(), index - 6));
    return {
      key,
      label: new Date(key).toLocaleDateString(undefined, { weekday: "short" }).slice(0, 1),
      minutes: state.studySessions.filter((session) => session.date === key).reduce((sum, session) => sum + session.minutes, 0),
    };
  });
  const maxStudy = Math.max(60, ...last7.map((day) => day.minutes));
  const projectAverage = Math.round(state.projects.reduce((sum, project) => sum + projectProgress(project), 0) / state.projects.length);
  return (
    <div className="space-y-3">
      <GlassCard>
        <p className="section-label">Last 7 Days Study Time</p>
        <div className="mt-4 flex h-28 items-end justify-between gap-2">
          {last7.map((day) => (
            <div className="flex flex-1 flex-col items-center gap-2" key={day.key}>
              <div className="w-full rounded-full bg-ink/10 p-1 dark:bg-bone/10">
                <div className="rounded-full bg-ink dark:bg-bone" style={{ height: `${Math.max(8, (day.minutes / maxStudy) * 84)}px` }} />
              </div>
              <span className="text-xs text-graphite/55 dark:text-bone/55">{day.label}</span>
            </div>
          ))}
        </div>
      </GlassCard>
      <div className="grid grid-cols-2 gap-3">
        <GlassCard>
          <p className="section-label">Study by Subject</p>
          <div className="mt-3 space-y-2">
            {state.courses.slice(0, 4).map((course) => <MiniBar key={course.name} label={course.name} value={course.weeklyMinutes} max={180} />)}
          </div>
        </GlassCard>
        <GlassCard>
          <p className="section-label">Projects Progress</p>
          <div className="mt-4 flex aspect-square items-center justify-center rounded-full border-[12px] border-ink/15 text-3xl font-semibold dark:border-bone/15">{projectAverage}%</div>
        </GlassCard>
      </div>
      <GlassCard>
        <p className="section-label">Applications by Status</p>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {(["Saved", "Applied", "Interview", "Offer"] as JobStatus[]).map((status) => (
            <div className="rounded-3xl bg-white/40 p-3 text-center dark:bg-white/5" key={status}>
              <p className="text-xl font-semibold">{jobCounts[status]}</p>
              <p className="mt-1 text-[11px] text-graphite/60 dark:text-bone/60">{status}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function Learning({
  courses,
  onStart,
  onCompleteLesson,
  onToggleTask,
}: {
  courses: Course[];
  onStart: (course: Course) => void;
  onCompleteLesson: (name: string) => void;
  onToggleTask: (courseName: string, week: number, label: string) => void;
}) {
  return (
    <div className="space-y-3">
      <PageTitle icon={<BookOpen />} title="Learning Center" subtitle="Weekly plans for SQL, Python, Pandas, Statistics, and Machine Learning." />
      {courses.map((course) => (
        <GlassCard key={course.name}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold">{course.name}</h3>
              <p className="mt-1 text-sm text-graphite/60 dark:text-bone/60">{course.lessonsCompleted}/{courseTaskTotal(course)} tasks · {course.todayGoal} min today</p>
            </div>
            <span className="rounded-full bg-white/55 px-3 py-1 text-sm font-semibold dark:bg-white/10">{coursePlanProgress(course)}%</span>
          </div>
          <Progress value={coursePlanProgress(course)} />
          <div className="mt-4 space-y-3">
            {course.weeklyPlan.map((week) => {
              const completed = week.tasks.filter((task) => task.done).length;
              return (
                <div className="rounded-3xl bg-white/35 p-3 dark:bg-white/5" key={week.week}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-graphite/50 dark:text-bone/50">Week {week.week}</p>
                      <h4 className="mt-1 text-sm font-semibold">{week.focus}</h4>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/55 px-2.5 py-1 text-xs font-semibold dark:bg-white/10">{completed}/{week.tasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {week.tasks.map((task) => (
                      <button
                        className="flex w-full items-center gap-3 rounded-2xl bg-bone/55 p-2.5 text-left text-sm dark:bg-ink/30"
                        key={task.label}
                        onClick={() => onToggleTask(course.name, week.week, task.label)}
                      >
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${task.done ? "bg-ink text-bone dark:bg-bone dark:text-ink" : "border-ink/20 dark:border-bone/20"}`}>
                          {task.done && <Check size={14} />}
                        </span>
                        <span className={task.done ? "text-graphite/45 line-through dark:text-bone/45" : ""}>{task.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Button onClick={() => onStart(course)} icon={<CirclePlay size={16} />}>Start</Button>
            <Button onClick={() => onCompleteLesson(course.name)} icon={<Check size={16} />}>Next</Button>
            <Button as="a" href={course.resource} icon={<ExternalLink size={16} />}>Resource</Button>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

function Projects({ projects, onToggle, onStage }: { projects: Project[]; onToggle: (projectName: string, itemLabel: string) => void; onStage: (projectName: string, stage: ProjectStage) => void }) {
  return (
    <div className="space-y-3">
      <PageTitle icon={<Code2 />} title="Projects" subtitle="Portfolio assets for clinical analytics and precision medicine roles." />
      {projects.map((project) => (
        <GlassCard key={project.name}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-semibold">{project.name}</h3>
            <span className="rounded-full bg-ink px-3 py-1 text-xs text-bone dark:bg-bone dark:text-ink">{projectProgress(project)}%</span>
          </div>
          <Progress value={projectProgress(project)} />
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
            {stages.map((stage) => (
              <button className={`stage-pill ${stage === project.stage ? "active" : ""}`} key={stage} onClick={() => onStage(project.name, stage)}>{stage}</button>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {project.checklist.map((item) => (
              <button className="flex w-full items-center gap-3 rounded-3xl bg-white/40 p-3 text-left text-sm dark:bg-white/5" key={item.label} onClick={() => onToggle(project.name, item.label)}>
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${item.done ? "bg-ink text-bone dark:bg-bone dark:text-ink" : "border-ink/20 dark:border-bone/20"}`}>{item.done && <Check size={14} />}</span>
                {item.label}
              </button>
            ))}
          </div>
          <p className="mt-4 rounded-3xl bg-white/35 p-3 text-sm text-graphite/70 dark:bg-white/5 dark:text-bone/70">{project.notes}</p>
          <a className="mt-3 inline-flex items-center gap-2 text-sm font-medium" href={project.github} target="_blank" rel="noreferrer">GitHub Link <ExternalLink size={14} /></a>
        </GlassCard>
      ))}
    </div>
  );
}

function Jobs({ jobs, counts, onAdd, onStatus }: { jobs: Job[]; counts: Record<JobStatus, number>; onAdd: (job: Job) => void; onStatus: (id: string, status: JobStatus) => void }) {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<JobStatus | "All">("All");
  const [draft, setDraft] = React.useState({ company: "", role: "", category: "Healthcare AI" });
  const filtered = jobs.filter((job) => {
    const matchesFilter = filter === "All" || job.status === filter;
    const matchesQuery = `${job.company} ${job.role} ${job.category}`.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });
  return (
    <div className="space-y-3">
      <PageTitle icon={<BriefcaseBusiness />} title="Job Tracker" subtitle="Track targeted roles across healthcare AI, clinical data, and precision medicine." />
      <GlassCard>
        <div className="grid grid-cols-4 gap-2">
          {(["Saved", "Applied", "Interview", "Offer"] as JobStatus[]).map((status) => (
            <div className="rounded-3xl bg-white/40 p-3 text-center dark:bg-white/5" key={status}>
              <p className="text-xl font-semibold">{counts[status]}</p>
              <p className="text-[11px] text-graphite/60 dark:text-bone/60">{status}</p>
            </div>
          ))}
        </div>
      </GlassCard>
      <GlassCard>
        <div className="flex items-center gap-2 rounded-3xl bg-white/50 px-3 py-2 dark:bg-white/5">
          <Search size={17} />
          <input className="w-full bg-transparent text-sm outline-none" placeholder="Search roles" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {(["All", ...statuses] as const).map((status) => (
            <button className={`stage-pill ${filter === status ? "active" : ""}`} onClick={() => setFilter(status)} key={status}>{status}</button>
          ))}
        </div>
      </GlassCard>
      <GlassCard>
        <p className="section-label">Add Opportunity</p>
        <div className="mt-3 grid gap-2">
          <Input placeholder="Company" value={draft.company} onChange={(company) => setDraft({ ...draft, company })} />
          <Input placeholder="Role" value={draft.role} onChange={(role) => setDraft({ ...draft, role })} />
          <Input placeholder="Category" value={draft.category} onChange={(category) => setDraft({ ...draft, category })} />
          <Button
            onClick={() => {
              if (!draft.company.trim() || !draft.role.trim()) return;
              onAdd({ id: crypto.randomUUID(), ...draft, dateAdded: todayKey(), status: "Saved" });
              setDraft({ company: "", role: "", category: "Healthcare AI" });
            }}
            icon={<Plus size={16} />}
          >
            Add Job
          </Button>
        </div>
      </GlassCard>
      {filtered.map((job) => (
        <GlassCard key={job.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">{job.company}</h3>
              <p className="mt-1 text-sm text-graphite/70 dark:text-bone/70">{job.role}</p>
              <p className="mt-2 text-xs text-graphite/55 dark:text-bone/55">{job.category} · {job.dateAdded}</p>
            </div>
            <label className="relative shrink-0">
              <select className="appearance-none rounded-full bg-white/55 py-2 pl-3 pr-8 text-xs font-semibold outline-none dark:bg-white/10" value={job.status} onChange={(event) => onStatus(job.id, event.target.value as JobStatus)}>
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-2.5" size={14} />
            </label>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

function Review({ reviews, onSave }: { reviews: ReviewEntry[]; onSave: (entry: ReviewEntry) => void }) {
  const [finished, setFinished] = React.useState("");
  const [focus, setFocus] = React.useState("");
  return (
    <div className="space-y-3">
      <PageTitle icon={<CalendarDays />} title="Weekly Review" subtitle="A quiet reset for what moved and what matters next." />
      <GlassCard>
        <label className="section-label">What I Finished This Week</label>
        <textarea className="field mt-2 min-h-28 resize-none" value={finished} onChange={(event) => setFinished(event.target.value)} />
        <label className="section-label mt-4 block">Focus Next Week</label>
        <textarea className="field mt-2 min-h-28 resize-none" value={focus} onChange={(event) => setFocus(event.target.value)} />
        <Button
          className="mt-4"
          onClick={() => {
            if (!finished.trim() && !focus.trim()) return;
            onSave({ id: crypto.randomUUID(), weekOf: todayKey(), finished, focus });
            setFinished("");
            setFocus("");
          }}
          icon={<Check size={16} />}
        >
          Save Review
        </Button>
      </GlassCard>
      {reviews.map((review) => (
        <GlassCard key={review.id}>
          <p className="section-label">{review.weekOf}</p>
          <h3 className="mt-3 font-semibold">What I Finished This Week</h3>
          <p className="mt-1 text-sm text-graphite/70 dark:text-bone/70">{review.finished}</p>
          <h3 className="mt-4 font-semibold">Focus Next Week</h3>
          <p className="mt-1 text-sm text-graphite/70 dark:text-bone/70">{review.focus}</p>
        </GlassCard>
      ))}
    </div>
  );
}

function StudyTimer({ course, onClose, onFinish }: { course: Course; onClose: () => void; onFinish: (course: string, minutes: number) => void }) {
  const [seconds, setSeconds] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);
  const minutes = Math.max(1, Math.round(seconds / 60));
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/35 p-4 backdrop-blur-sm sm:items-center">
      <motion.div className="w-full max-w-[480px] rounded-5xl border border-white/35 bg-ivory/90 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-graphite/90" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <p className="section-label">Study Timer</p>
        <h2 className="mt-2 text-2xl font-semibold">{course.name}</h2>
        <div className="my-8 text-center">
          <p className="text-6xl font-semibold tabular-nums">{formatTime(seconds)}</p>
          <p className="mt-2 text-sm text-graphite/60 dark:text-bone/60">Goal {course.todayGoal} minutes</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {!running ? <Button onClick={() => setRunning(true)} icon={<Play size={16} />}>{seconds ? "Resume" : "Start"}</Button> : <Button onClick={() => setRunning(false)} icon={<Pause size={16} />}>Pause</Button>}
          <Button onClick={() => { setRunning(false); setSeconds(0); }} icon={<TimerReset size={16} />}>Reset</Button>
          <Button onClick={() => { onFinish(course.name, minutes); onClose(); }} icon={<Square size={16} />}>Finish</Button>
          <Button onClick={onClose} icon={<ChevronDown size={16} />}>Close</Button>
        </div>
      </motion.div>
    </div>
  );
}

function BottomNav({ activeTab, onChange }: { activeTab: Tab; onChange: (tab: Tab) => void }) {
  const tabs: { tab: Tab; icon: React.ReactNode }[] = [
    { tab: "Dashboard", icon: <Home size={20} /> },
    { tab: "Learning", icon: <BookOpen size={20} /> },
    { tab: "Projects", icon: <Code2 size={20} /> },
    { tab: "Jobs", icon: <BriefcaseBusiness size={20} /> },
    { tab: "Review", icon: <CalendarDays size={20} /> },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[520px] px-3 pb-3">
      <div className="grid grid-cols-5 rounded-4xl border border-white/35 bg-bone/72 p-2 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-graphite/72">
        {tabs.map(({ tab, icon }) => (
          <button className={`nav-item ${activeTab === tab ? "active" : ""}`} onClick={() => onChange(tab)} key={tab} aria-label={tab}>
            {icon}
            <span>{tab}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function PageTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="rounded-3xl bg-white/45 p-3 shadow-inset dark:bg-white/5">{icon}</div>
      <div>
        <h2 className="text-3xl font-semibold tracking-normal">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-graphite/65 dark:text-bone/65">{subtitle}</p>
      </div>
    </div>
  );
}

function GlassCard({ children }: { children: React.ReactNode }) {
  return <section className="rounded-4xl border border-white/40 bg-white/38 p-4 shadow-glass shadow-inset backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.06]">{children}</section>;
}

function Metric({ icon, label, value, suffix }: { icon: React.ReactElement; label: string; value: string; suffix: string }) {
  return (
    <GlassCard>
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/45 dark:bg-white/10">{React.cloneElement(icon, { size: 18 })}</div>
      <p className="section-label">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      <p className="text-sm text-graphite/55 dark:text-bone/55">{suffix}</p>
    </GlassCard>
  );
}

function ProgressCard({ label, value, goal }: { label: string; value: number; goal: number }) {
  return (
    <GlassCard>
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/45 dark:bg-white/10"><Clock3 size={18} /></div>
      <p className="section-label">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      <p className="text-sm text-graphite/55 dark:text-bone/55">of {goal} min</p>
      <Progress value={(value / goal) * 100} />
    </GlassCard>
  );
}

function MiniBar({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs"><span>{label}</span><span>{value}m</span></div>
      <Progress value={(value / max) * 100} />
    </div>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/10 dark:bg-bone/10">
      <motion.div className="h-full rounded-full bg-ink dark:bg-bone" initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.max(0, value))}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
    </div>
  );
}

function Button({ children, icon, as, href, className = "", onClick }: { children: React.ReactNode; icon?: React.ReactNode; as?: "a"; href?: string; className?: string; onClick?: () => void }) {
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-3xl bg-ink px-3 text-sm font-semibold text-bone transition hover:scale-[1.01] active:scale-[0.99] dark:bg-bone dark:text-ink ${className}`;
  if (as === "a") return <a className={classes} href={href} target="_blank" rel="noreferrer">{icon}{children}</a>;
  return <button className={classes} onClick={onClick}>{icon}{children}</button>;
}

function IconButton({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return <button aria-label={label} title={label} onClick={onClick} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-white/42 shadow-inset backdrop-blur-xl transition active:scale-95 dark:border-white/10 dark:bg-white/5">{children}</button>;
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <input className="field" placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />;
}

function countByStatus(jobs: Job[]) {
  return statuses.reduce((counts, status) => ({ ...counts, [status]: jobs.filter((job) => job.status === status).length }), {} as Record<JobStatus, number>);
}

function formatTime(seconds: number) {
  const min = Math.floor(seconds / 60).toString().padStart(2, "0");
  const sec = (seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

function toCsv(state: AppState) {
  const rows = [
    ["type", "name", "metric", "value"],
    ...state.courses.map((course) => ["course", course.name, "progress", coursePlanProgress(course).toString()]),
    ...state.courses.flatMap((course) =>
      course.weeklyPlan.flatMap((week) =>
        week.tasks.map((task) => ["weekly_task", course.name, `Week ${week.week}: ${week.focus}`, `${task.done ? "done" : "todo"} - ${task.label}`]),
      ),
    ),
    ...state.projects.map((project) => ["project", project.name, "progress", projectProgress(project).toString()]),
    ...state.jobs.map((job) => ["job", job.company, job.status, job.role]),
    ...state.studySessions.map((session) => ["study", session.course, session.date, session.minutes.toString()]),
  ];
  return rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
