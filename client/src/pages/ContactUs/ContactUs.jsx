import { useState } from "react";
import "./ContactUs.css";
import NavBar from "../../components/layout/NavBar";
import Footer from "../../components/layout/Footer";

const ContactUs = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Send data to server/email service
        alert("Message submitted! We'll get back to you soon.");
        setForm({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <div className="contact-container">
            <header>
                <NavBar />
            </header>
            <div className="contact-us-container">
                <h2>Contact Us</h2>
                <p>Have a question or feedback about your budget? Reach out!</p>
                <form onSubmit={handleSubmit} className="contact-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        value={form.subject}
                        onChange={handleChange}
                    />
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        value={form.message}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Send Message</button>
                </form>
            </div>
            <footer>
                <Footer />
            </footer>
        </div>

    );
};

export default ContactUs;