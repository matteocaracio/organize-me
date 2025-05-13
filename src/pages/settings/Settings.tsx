
import { useParams } from "react-router-dom";
import SettingsLayout from "./SettingsLayout";
import ProfileSettings from "./ProfileSettings";
import EmailSettings from "./EmailSettings";
import PasswordSettings from "./PasswordSettings";
import NotificationSettings from "./NotificationSettings";

const Settings = () => {
  const { section = "profile" } = useParams<{ section: string }>();

  const renderSection = () => {
    switch (section) {
      case "profile":
        return <ProfileSettings />;
      case "email":
        return <EmailSettings />;
      case "password":
        return <PasswordSettings />;
      case "notifications":
        return <NotificationSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <SettingsLayout>
      {renderSection()}
    </SettingsLayout>
  );
};

export default Settings;
