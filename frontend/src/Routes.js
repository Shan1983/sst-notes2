import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import NewNote from "./containers/NewNote";
import NotFound from "./containers/NotFound";
import SignUp from "./containers/SignUp";
import Notes from "./containers/Notes";

export default function Links() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/signup" element={<SignUp />} />
      <Route exact path="/notes/new" element={<NewNote />} />
      <Route exact path="/notes/:id" element={<Notes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
