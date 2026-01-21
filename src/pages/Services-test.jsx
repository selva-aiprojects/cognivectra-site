import { Link } from "react-router-dom";

export default function Services() {
    return (
        <section className="section" style={{ padding: "6rem 0" }}>
            <div className="container">
                <h1>Services</h1>
                <p>Services page is working!</p>
                <Link to="/" className="btn">Back to Home</Link>
            </div>
        </section>
    );
}
