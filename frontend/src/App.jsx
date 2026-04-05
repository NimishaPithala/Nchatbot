{/*
import Chat from "./components/Chat";
export default function App() {
  return <Chat />;
}

*/}

import { useState } from "react";
import MainPage from "./components/MainPage";

export default function App() {
  const [user] = useState({ name: "Student", email: "student@school.edu" });
  return <MainPage user={user} />;
}