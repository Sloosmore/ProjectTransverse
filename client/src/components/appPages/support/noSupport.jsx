const NoAudioSupport = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1 className="text-center p-5">
        Hey! this browser does not currently support speech recognition. We are
        aware of the issue and activley working on a fix for it.
      </h1>
      <h2 className="text-muted">
        The best way to use Transverse is with the latest version of Google
        Chrome.
      </h2>
    </div>
  );
};

export default NoAudioSupport;
