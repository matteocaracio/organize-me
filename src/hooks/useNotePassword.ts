
import { useState, useEffect } from "react";
import { usePasswordValidation } from "./password/usePasswordValidation";
import { usePasswordManagement } from "./password/usePasswordManagement";
import { usePasswordUpdate } from "./password/usePasswordUpdate";
import { useGlobalPasswordCheck } from "./password/useGlobalPasswordCheck";

export const useNotePassword = () => {
  const [password, setPassword] = useState("");
  const [notePassword, setNotePassword] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [hasGlobalPassword, setHasGlobalPassword] = useState(false);
  
  const { checkGlobalPassword } = useGlobalPasswordCheck(setHasGlobalPassword, setNotePassword);
  const { validatePassword } = usePasswordValidation(password, setNotePassword);
  const { saveGlobalPassword } = usePasswordManagement(password, setNotePassword, setHasGlobalPassword);
  const { validateAndUpdateGlobalPassword } = usePasswordUpdate(
    currentPassword, 
    newPassword, 
    confirmPassword, 
    setNotePassword,
    setPasswordMismatch
  );
  
  // Check if global password is set on component mount
  useEffect(() => {
    checkGlobalPassword();
  }, []);

  return {
    password,
    setPassword,
    notePassword,
    setNotePassword,
    validatePassword,
    saveGlobalPassword,
    // New password update fields
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordMismatch,
    validateAndUpdateGlobalPassword,
    hasGlobalPassword,
    checkGlobalPassword,
  };
};
