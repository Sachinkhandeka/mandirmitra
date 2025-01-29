import { useState, useEffect } from "react";
import EmptyState from "../../EmptyState";
import Alert from "../../Alert";
import { Helmet } from "react-helmet-async";
import PostCard from "../PostCard";

export default function TemplePosts({ templeId, templeName }) {
    const [posts, setPosts] = useState([]);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);

    const fetchAllPosts = async () => {
        setAlert({ type: "", message: "" });
        setLoading(true);
        try {
            const response = await fetch(`/api/post/${templeId}`);
            const data = await response.json();

            if (!response.ok) {
                setAlert({ type: "error", message: data.message });
                return;
            }

            setPosts(data.posts);
        } catch (error) {
            setAlert({ type: "error", message: error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (templeId) fetchAllPosts();
    }, [templeId]);

    return (
        <section className="p-1 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <Helmet>
                <title>{`${templeName} - News & Updates | MandirMitra`}</title> 
                <meta
                    name="description"
                    content={`Stay connected with ${templeName}! Explore the latest news, events, announcements, and inspiring stories from this temple. Follow for updates, engage with the community, and stay informed about upcoming activities.`}
                />
                <meta
                    name="keywords"
                    content={`${templeName} news, ${templeName} updates, ${templeName} events, ${templeName} announcements, ${templeName} blog, temple news, temple updates, temple events, temple blog, hindu temple news, indian temples, temple community, spiritual news`}
                />
                <meta property="og:title" content={`${templeName} - News & Updates | MandirMitra`} />
                <meta
                    property="og:description"
                    content={`Stay connected with ${templeName}! Explore the latest news, events, announcements, and inspiring stories from this temple. Follow for updates, engage with the community, and stay informed about upcoming activities.`}
                />
                <meta property="og:url" content={window.location.href} />
            </Helmet>
            {/* Alert Message */}
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert && alert.message && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        autoDismiss
                        onClose={() => setAlert(null)}
                    />
                )}
            </div>
            { posts && posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} setAlert={setAlert} />
                    ))}
                </div>
            ) : (
                <EmptyState message={"Posts not available yet for this temple!"} />
            ) }
        </section>
    );
}

