import { useEffect, useState, useRef, useCallback } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { IoCheckmarkDone } from "react-icons/io5";
import { TbFaceIdError } from "react-icons/tb"; 
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import EventCard from "../EventCard";
import ToggleSwitch from "../ToggleSwitch";
import { useLocation } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";
import Alert from "../Alert";

export default function DashEvents() {
    const navigate = useNavigate();
    const { currUser } = useSelector(state => state.user);
    const { searchTerm } = useSelector(state => state.searchTerm);
    const location = useLocation();
    const [events, setEvents] = useState([]);
    const [isEventUpdated, setIsEventUpdated] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type : "", message : "" });

    const queryParams = new URLSearchParams(location.search);

    const scrollRef = useRef(null);

    const scrollLeft = () => {
        scrollRef.current.scrollBy({ left: -325, behavior: 'smooth' });
    };

    const scrollRight = () => {
        scrollRef.current.scrollBy({ left: 325, behavior: 'smooth' });
    };

    // Get events
    const getEvents = async () => {
        setLoading(true);
        setAlert({ type : "", message : "" });
        try {
            const data = await fetchWithAuth(
                `/api/event/get/${currUser.templeId}`,
                {},
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate,
            );
            if(data) {
                setLoading(false);
                setEvents(data.events);
            }
        } catch (err) {
            setLoading(false);
            setAlert({ type : "error", message : err.message });
        }
    };

    useEffect(() => {
        getEvents();
    }, [currUser]);

    useEffect(() => {
        if (isEventUpdated) {
            getEvents();
            setIsEventUpdated(false);
        }
    }, [isEventUpdated]);

    // Get invited donors
    const getGuestsData = async () => {
        if (!selectedEventId) return;
        
        const tab = queryParams.get("tab");

        // Conditionally include searchTerm only when tab is 'events'
        const searchParam = tab === 'events' ? `?searchTerm=${searchTerm}` : '';
        
        try {
            setLoading(true);
            setAlert({ type : "", message : "" });
            const data = await fetchWithAuth(
                `/api/invitation/get/${currUser.templeId}/${selectedEventId}/${searchParam !== '' ?  searchParam : '' }`,
                {},
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                setLoading(false);
                setGuests(data.guests);
            }
        } catch (err) {
            setAlert({ type : "error", message : err.message });
            setLoading(false);
        }
    };

    //debounce getGuestData function 
    const debouncedFetchGuests = useCallback(debounce(getGuestsData, 500), [selectedEventId, searchTerm]);

    useEffect(() => {
        debouncedFetchGuests();
    }, [selectedEventId, searchTerm]);

    // Handle verification toggle
    const handleVerificationToggle = async (guestId, verified) => {
        setLoading(true);
        setAlert({ type : "", message : "" });
        try {
            const data = await fetchWithAuth(
                `/api/invitation/edit/${currUser.templeId}/${selectedEventId}`, 
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({ guestId, attended: verified }),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate,
            );
            
            if (data) {
                setLoading(false);
                setIsEventUpdated(true); 
            } else {
                setLoading(false);
                setAlert({ type : "error", message : "Failed to update invitation status" });
            }
        } catch (err) {
            setAlert({ type : "error", message : err.message });
        }
    };

    return (
        <>
            <Helmet>
                <title>Manage Temple Events - Dashboard</title>
                <meta name="description" content="Manage and track temple events in your dashboard. View, edit, and delete events with ease." />
            </Helmet>
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                {alert.message && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        autoDismiss
                        duration={6000}
                        onClose={()=> setAlert({ type : "", message : "" })}
                    />
                )}
            </div>
            {events && events.length > 0 && (
                (currUser && currUser.isAdmin) ||
                (currUser.roles && currUser.roles.some(role =>
                    role.permissions.some(p =>
                        p.actions.includes("read") || p.actions.includes("update") || p.actions.includes("delete"))))
            ) && (
                <div className="mb-6 sticky left-0">
                    <div className="relative">
                        <IoIosArrowBack
                            className="absolute z-30 left-0 top-1/2 transform -translate-y-1/2 cursor-pointer border border-slate-500 rounded-full p-2 hover:shadow-lg"
                            size={36}
                            onClick={scrollLeft}
                        />
                        <div
                            ref={scrollRef}
                            className="flex overflow-x-scroll scrollbar-hidden"
                        >
                            {events && events.map(event => (
                                <EventCard
                                    key={event._id}
                                    id={event._id}
                                    name={event.name}
                                    date={event.date}
                                    location={event.location}
                                    status={event.status}
                                    setIsEventUpdated={setIsEventUpdated}
                                    isSelected={selectedEventId === event._id}
                                    onClick={() => setSelectedEventId(event._id)}
                                />
                            ))}
                        </div>
                        <IoIosArrowForward
                            className="absolute z-30 right-0 top-1/2 transform -translate-y-1/2 cursor-pointer border border-slate-500 rounded-full p-2 hover:shadow-lg"
                            size={36}
                            onClick={scrollRight}
                        />
                    </div>
                </div>
            )}
            {events && events.length === 0 && (
                <div className="flex justify-center items-center h-screen">
                    <div className="text-center flex flex-col items-center justify-center">
                        <TbFaceIdError size={50} className="animate-bounce" />
                        <p>No Events Available</p>
                    </div>
                </div>
            )}
            {selectedEventId && events && events.length > 0 && (
                (currUser && currUser.isAdmin) ||
                (currUser.roles && currUser.roles.some(role =>
                    role.permissions.some(p =>
                        p.actions.includes("read"))))
            ) && (
                guests && guests.length > 0 ? (
                    <Table striped>
                        <Table.Head>
                            <Table.HeadCell>Sr.No</Table.HeadCell>
                            <Table.HeadCell>Event</Table.HeadCell>
                            <Table.HeadCell>Guest Name</Table.HeadCell>
                            <Table.HeadCell>PassCode</Table.HeadCell>
                            <Table.HeadCell>Invited</Table.HeadCell>
                            {(currUser && currUser.isAdmin ||
                                (currUser.roles &&
                                    currUser.roles.some(role =>
                                        role.permissions.some(p => p.actions.includes("update") || p.actions.includes("delete")))
                                )) && <Table.HeadCell>Verify Guest</Table.HeadCell>
                            }
                        </Table.Head>
                        <Table.Body>
                            {guests.map((guest, indx) => (
                                <Table.Row key={guest._id}>
                                    <Table.Cell>{ indx + 1 }</Table.Cell>
                                    <Table.Cell>{guest.event.name}</Table.Cell>
                                    <Table.Cell>{guest.donorName}</Table.Cell>
                                    <Table.Cell>{guest.passCode}</Table.Cell>
                                    <Table.Cell>{guest.invited === true ? <IoCheckmarkDone  size={24} color="green" /> : null}</Table.Cell>
                                    {(currUser && currUser.isAdmin ||
                                        (currUser.roles &&
                                            currUser.roles.some(role =>
                                                role.permissions.some(p => p.actions.includes("update")))
                                        )) && (
                                            <Table.Cell>
                                                <ToggleSwitch
                                                    checked={guest.attended}
                                                    onChange={(checked) => handleVerificationToggle(guest._id, checked)}
                                                    isDisabled={guest.event.status === "completed"}
                                                />
                                            </Table.Cell>
                                        )}
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                ) : (
                    <div className="flex justify-center items-center h-screen">
                        <div className="text-center flex flex-col items-center justify-center">
                            <TbFaceIdError size={50} className="animate-bounce" />
                            <p>No Guest Invited yet!</p>
                        </div>
                    </div>
                )
            )}
        </>
    );
}
