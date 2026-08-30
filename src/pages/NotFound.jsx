import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";

export default function NotFound() {
  return (
    <PageTransition className="page-shell">
      <div className="container not-found">
        <div>
          <span className="eyebrow">404</span>
          <h1 className="title-lg">This frame is empty.</h1>
          <p className="lead">The page you’re looking for does not exist.</p>
          <Link className="btn" to="/">
            Back home
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
