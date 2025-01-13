import Alert from "../Alert";
import EditGenInfo from "./EditGenInfo";
import TempleAdminNavigation from "./TempleAdminNavigation";

export default function TempleAdminControls ({ temple, setTemple, setAlert }) {
    return (
        <section
            className="text-black dark:text-white min-h-screen mb-8"
            aria-labelledby="temple-details-title"
        >
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                )}
            </div>
            <EditGenInfo temple={temple} setTemple={setTemple} setAlert={setAlert} />
            <TempleAdminNavigation temple={temple} setTemple={setTemple} setAlert={setAlert}  />
        </section>
    );
}