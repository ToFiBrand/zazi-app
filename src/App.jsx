import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppShell from './components/AppShell'
import AuthShell from './components/AuthShell'
import DashboardShell from './components/DashboardShell'

import SplashScreen from './screens/SplashScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import AuthScreen from './screens/AuthScreen'
import SignUpScreen from './screens/SignUpScreen'
import InterestsScreen from './screens/InterestsScreen'
import HomeScreen from './screens/HomeScreen'
import LearnScreen from './screens/LearnScreen'
import LessonDetailScreen from './screens/LessonDetailScreen'
import ExploreScreen from './screens/ExploreScreen'
import ContentViewScreen from './screens/ContentViewScreen'
import CareerHubScreen from './screens/CareerHubScreen'
import CreateContentScreen from './screens/CreateContentScreen'
import CreateSubmissionScreen from './screens/CreateSubmissionScreen'
import ProfileScreen from './screens/ProfileScreen'
import NotificationsScreen from './screens/NotificationsScreen'
import ContributorApplicationScreen from './screens/ContributorApplicationScreen'
import AdminDashboard from './screens/AdminDashboard'
import SponsorDashboard from './screens/SponsorDashboard'
import TeacherDashboard from './screens/TeacherDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {/* Auth / onboarding — centered card on desktop, full-bleed on mobile */}
          <Route element={<AuthShell />}>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/onboarding" element={<OnboardingScreen />} />
            <Route path="/login" element={<AuthScreen />} />
            <Route path="/signup" element={<SignUpScreen />} />
            <Route path="/interests" element={<InterestsScreen />} />
          </Route>

          {/* Student app — sidebar on desktop, bottom tab bar on mobile */}
          <Route element={<AppShell />}>
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/learn" element={<LearnScreen />} />
            <Route path="/learn/:lessonId" element={<LessonDetailScreen />} />
            <Route path="/career" element={<CareerHubScreen />} />
            <Route path="/create" element={<CreateContentScreen />} />
            <Route path="/create/:type" element={<CreateSubmissionScreen />} />
            <Route path="/explore" element={<ExploreScreen />} />
            <Route path="/explore/:contentId" element={<ContentViewScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/notifications" element={<NotificationsScreen />} />
            <Route path="/contributor-application" element={<ContributorApplicationScreen />} />
          </Route>

          {/* Role dashboards — desktop-first, own internal layout */}
          <Route element={<DashboardShell />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/sponsor" element={<SponsorDashboard />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
