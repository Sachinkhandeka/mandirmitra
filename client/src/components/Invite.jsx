import { Modal, Card, Button, Spinner } from "flowbite-react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { FaFilePdf } from "react-icons/fa6";
import { HiCheckCircle } from "react-icons/hi";
import Invitation from "../pdf/Invitation";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../utilityFunx";
import Alert from "./Alert";

export default function Invite({ inviteModal, setInviteModal, name, location, date, id }) {
    const navigate = useNavigate();
    const { currUser } = useSelector(state => state.user);
    const [donations, setDonations] = useState([]);
    const [selectedDonors, setSelectedDonors] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [temple, setTemple] = useState({});
    const [alert, setAlert] = useState({ type : "", message : "" });
    const [loading, setLoading] = useState(false);
    const [invitationsPdf, setInvitationsPdf] = useState([]);
    const [downloaded, setDownloaded] = useState([]);

    //to track the download  staatus of pdf
    const handleDownload = (index) => {
        setDownloaded([...downloaded, index]);
    };

    const getAllDonations = useCallback(async () => {
        setLoading(true);
        setAlert({ type : "", message : "" });
        try {
            const  data = await fetchWithAuth(
                `/api/donation/get/${currUser.templeId}`,
                {},
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                setDonations(data.daans);
                setTemple(data.daans[0].temple);
            }
        } catch (err) {
            setAlert({ type : "error", message : err.message });
        }
    }, [currUser.templeId]);

    useEffect(() => {
        getAllDonations();
    }, [currUser, getAllDonations]);

    const handleSelectAll = useCallback(() => {
        if (selectAll) {
            setSelectedDonors([]);
        } else {
            setSelectedDonors(donations.map(donor => donor._id));
        }
        setSelectAll(!selectAll);
    }, [selectAll, donations]);

    const handleSelectDonor = useCallback((donor_id) => {
        if (selectedDonors.includes(donor_id)) {
            setSelectedDonors(selectedDonors.filter(id => id !== donor_id));
        } else {
            setSelectedDonors([...selectedDonors, donor_id]);
        }
    }, [selectedDonors]);

    const sendInvitations = async () => {
        setLoading(true);
        setAlert({ type : "", message : "" });

        try {
            let selectedDonorDetails = await Promise.all(selectedDonors.map(async (donorId) => {
                const data = await fetchWithAuth(
                    `/api/donation/${currUser.templeId}/${donorId}`,
                    {},
                    refreshSuperAdminOrUserAccessToken,
                    "User",
                    setLoading,
                    setAlert,
                    navigate
                )
                if(data) {
                    return data.daan;
                }
            }));

            selectedDonorDetails = selectedDonorDetails.flat();

            let pdfs = [];

            await Promise.all(
                selectedDonorDetails.map(async (donor, indx) => {
                    const passCode = `${donor.donorName.split(' ').join('-')}-${indx + 1}`;
                    let invitation = {
                        donorName: donor.donorName,
                        passCode: passCode,
                        invited: true,
                    }
                    let fileName = `${donor.donorName}_${donor.contactInfo}.pdf`;
                    let document = {
                        donor: donor.donorName,
                        passCode: passCode,
                    };
                    const data = await fetchWithAuth(
                        `/api/invitation/save/${currUser.templeId}/${id}`,
                        {
                            method: "POST",
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(invitation),
                        },
                        refreshSuperAdminOrUserAccessToken,
                        "User",
                        setLoading,
                        setAlert,
                        navigate
                    );
                    if(data) {
                        pdfs.push({ document, fileName });
                    }
                })
            );

            setInvitationsPdf(pdfs);
            setLoading(false);
            setAlert({ type : "success", message : "Invitations generated successfully." });
        } catch (err) {
            setLoading(false);
            setAlert({ type : "error", message : err.message });
        }
    };
    const donorList = useMemo(() => (
        donations.map(donor => (
            <li key={donor._id} className="py-3 sm:py-4">
                <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{donor.donorName}</p>
                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">{donor.contactInfo}</p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white pr-8">
                        <input
                            type="checkbox"
                            className="text-yellow-600 cursor-pointer rounded-md"
                            checked={selectedDonors.includes(donor._id)}
                            onChange={() => handleSelectDonor(donor._id)}
                        />
                    </div>
                </div>
            </li>
        ))
    ), [donations, selectedDonors, handleSelectDonor]);

    return (
        <>
            <Helmet>
                <title>Invite Your Special/ Valuable Donors</title>
                <meta name="description" content="Invite your donor with amazing and cutome pdf generation for each donor you can download it  and then send it to you special/valuable donors." />
                <meta
                    name="keywords"
                    content="MandirMitra, temples, invitations, invitation-pdf, custome, Hinduism, deities, donations, expenses"
                />
            </Helmet>
            <Modal show={inviteModal} dismissible onClose={() => setInviteModal(false)}>
                <Modal.Header>Invite Your Special Donors</Modal.Header>
                <Modal.Body>
                    <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                        {alert && alert.message && (
                            <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                        )}
                    </div>
                    <div className="bg-gradient-to-br from-green-100 to-blue-100 p-4 rounded-md">
                        <div className="flex gap-2 items-center">
                            <h3 className="text-2xl font-bold font-serif text-blue-600">{name}</h3>
                            <p className="text-sm font-serif text-red-600 bg-red-100 rounded-md px-3 py-1">
                                {new Date(date).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: '2-digit',
                                    year: 'numeric',
                                })}
                            </p>
                        </div>
                        <p className="text-sm font-serif text-green-600 p-3">{location}</p>
                    </div>
                    <div className="w-full my-4">
                        <h2 className="text-xl md:text-2xl font-mono uppercase text-blue-600 my-2">Preview Invitation</h2>
                        <PDFViewer width={"100%"}>
                            <Invitation 
                                name={name}
                                location={location}
                                date={date}
                                temple={temple}
                            />
                        </PDFViewer>
                    </div>
                    <Card className="mt-4">
                        <div className="mb-4 flex items-center justify-between">
                            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Donor List</h5>
                            <input
                                type="checkbox"
                                className="text-yellow-600 cursor-pointer rounded-sm"
                                checked={selectAll}
                                onChange={handleSelectAll}
                            />
                        </div>
                        <div className="flow-root max-h-64 overflow-y-auto">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {donorList}
                            </ul>
                        </div>
                        {selectedDonors && selectedDonors.length > 0 && (
                            <div className="mb-4 flex items-center justify-between border-2 border-yellow-400 p-4 bg-gradient-to-tr from-yellow-100 to-yellow-300 rounded-lg">
                                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Generate Invitation</h5>
                                <Button 
                                    gradientMonochrome={"success"} 
                                    onClick={sendInvitations}
                                    disabled={loading}
                                >
                                    { loading ? <Spinner color={"success"} /> : "Generate" }
                                </Button>
                            </div>
                        )}
                        {invitationsPdf && invitationsPdf.length > 0 && (
                            <div className="mb-4 flex flex-wrap gap-4 items-center border-2 border-blue-400 p-4 bg-gradient-to-tr from-blue-100 to-blue-300 rounded-lg">
                                {invitationsPdf.map((invitation, index) => (
                                    <PDFDownloadLink
                                        key={index}
                                        document={
                                            <Invitation 
                                                name={name}
                                                location={location}
                                                date={date}
                                                donor={invitation.document.donor}
                                                temple={temple}
                                                passCode={invitation.document.passCode}
                                            />}
                                        fileName={invitation.fileName}
                                    >
                                        {({ loading }) => (
                                            <Button
                                            color={downloaded.includes(index) ? "success" : "failure"}
                                            pill
                                            disabled={loading}
                                            size={15}
                                            className="py-1 px-2 text-xs flex items-center"
                                            onClick={() => handleDownload(index)}
                                        >
                                            {
                                                loading ? 'Loading invitation...' : 
                                                downloaded.includes(index) ? 
                                                'Downloaded' : `Download ${invitation.document.donor}` 
                                            }
                                            {downloaded.includes(index) ? <HiCheckCircle className="ml-2 h-4 w-4" /> : <FaFilePdf className="ml-2 h-4 w-4" />}
                                        </Button>
                                        )}
                                    </PDFDownloadLink>
                                ))}
                            </div>
                        )}
                    </Card>
                </Modal.Body>
            </Modal>
        </>
    );
}
