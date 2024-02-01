import "bootstrap/dist/css/bootstrap.min.css";

function LoadNote() {
  return (
    <div className="mt-4 mb-5">
      <h3 className="placeholder-glow">
        <span className="placeholder col-6"></span>
      </h3>
      <p className="placeholder-glow mt-3">
        <span className="placeholder col-7 "></span>
        <span className="placeholder col-4"></span>
        <span className="placeholder col-4 mt-3"></span>
        <span className="placeholder col-6 mt-3"></span>
        <span className="placeholder col-8 mt-3"></span>
      </p>
    </div>
  );
}

export default LoadNote;
