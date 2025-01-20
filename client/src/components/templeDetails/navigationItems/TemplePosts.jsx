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
                <title>{`${templeName} - Posts and Updates | MandirMitra`}</title>
                <meta
                    name="description"
                    content="Stay updated with the latest posts and happenings of this temple. Explore events, updates, and more."
                />
                <meta
                    name="keywords"
                    content="temple posts, temple updates, temple news, MandirMitra"
                />
                <meta
                    property="og:title"
                    content={`${templeName} - Posts and Updates | MandirMitra`}
                />
                <meta
                    property="og:description"
                    content="Stay updated with the latest posts and happenings of this temple."
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

