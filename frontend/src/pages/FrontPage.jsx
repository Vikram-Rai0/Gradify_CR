const FrontPage = () => {
    return (
        <div className="bg-gray-50 text-gray-800 flex flex-col min-h-screen font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <img src="/logo.svg" alt="Gradify Logo" className="h-8 w-8" />
                        <h1 className="text-xl font-bold text-blue-700">Gradify Classroom</h1>
                    </div>
                    <nav className="hidden md:flex space-x-6">
                        <a href="/" className="hover:text-blue-500 transition">Home</a>
                        <a href="/classes" className="hover:text-blue-500 transition">Classes</a>
                        <a href="/assignments" className="hover:text-blue-500 transition">Assignments</a>
                        <a href="/announcements" className="hover:text-blue-500 transition">Announcements</a>
                    </nav>
                    <div className="space-x-4">
                        <a href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-500 transition">
                            Login
                        </a>
                        <a
                            href="/signup"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                        >
                            Sign Up
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-50 to-blue-100 flex-grow">
                <div className="container mx-auto px-6 py-20 text-center md:text-left flex flex-col md:flex-row items-center md:space-x-10">
                    <div className="md:w-1/2">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Simplify Your Project & Class Management
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Gradify Classroom helps you organize classes, submit projects, review assignments,
                            and stay updated — all in one place.
                        </p>
                        <div className="space-x-4">
                            <a
                                href="/signup"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
                            >
                                Get Started
                            </a>
                            <a
                                href="/learn-more"
                                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                    <div className="md:w-1/2 mt-10 md:mt-0">
                        <img
                            src="/hero-illustration.svg"
                            alt="Classroom Illustration"
                            className="w-full max-w-lg mx-auto"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-16">
                <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
                    Why Choose Gradify?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
                        <img src="/icon-classes.svg" alt="Classes" className="h-12 mb-4" />
                        <h4 className="text-xl font-semibold text-blue-600 mb-3">Organized Classes</h4>
                        <p className="text-gray-600">
                            Create, join, and manage classes with ease. Access all your course materials in one place.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
                        <img src="/icon-assignments.svg" alt="Assignments" className="h-12 mb-4" />
                        <h4 className="text-xl font-semibold text-blue-600 mb-3">Assignments Made Easy</h4>
                        <p className="text-gray-600">
                            Assign, submit, and grade work seamlessly with file uploads, deadlines, and feedback tools.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
                        <img src="/icon-announcements.svg" alt="Announcements" className="h-12 mb-4" />
                        <h4 className="text-xl font-semibold text-blue-600 mb-3">Stay Informed</h4>
                        <p className="text-gray-600">
                            Receive and post important announcements in real-time so everyone stays on track.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white shadow-inner mt-auto">
                <div className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
                    <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Gradify Classroom</h5>
                        <p>
                            Your trusted platform for efficient class and project management.
                        </p>
                    </div>
                    <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Quick Links</h5>
                        <ul className="space-y-2">
                            <li><a href="/" className="hover:text-blue-500">Home</a></li>
                            <li><a href="/classes" className="hover:text-blue-500">Classes</a></li>
                            <li><a href="/assignments" className="hover:text-blue-500">Assignments</a></li>
                            <li><a href="/contact" className="hover:text-blue-500">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Contact</h5>
                        <p>Email: support@gradify.com</p>
                        <p>Phone: +977-9800000000</p>
                    </div>
                </div>
                <div className="border-t mt-6 pt-4 text-center text-gray-500 text-xs">
                    &copy; {new Date().getFullYear()} Gradify Classroom. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default FrontPage;
