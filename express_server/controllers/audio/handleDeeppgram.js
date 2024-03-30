const { DeepgramError, createClient } = require("@deepgram/sdk");

const deepgramAPI = async (req, res) => {
  const url = req.url;
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY ?? "");

  let { result: projectsResult, error: projectsError } =
    await deepgram.manage.getProjects();

  if (projectsError) {
    return res.status(500).json(projectsError);
  }

  const project = projectsResult?.projects[0];

  if (!project) {
    return res
      .status(404)
      .json(
        new DeepgramError(
          "Cannot find a Deepgram project. Please create a project first."
        )
      );
  }

  let { result: newKeyResult, error: newKeyError } =
    await deepgram.manage.createProjectKey(project.project_id, {
      comment: "Temporary API key",
      scopes: ["usage:write"],
      tags: ["vite-app"],
      time_to_live_in_seconds: 10,
    });

  if (newKeyError) {
    return res.status(500).json(newKeyError);
  }

  return res.json({ ...newKeyResult, url });
};
