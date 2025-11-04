function enforceOrgFromToken(req, res, next) {
  try {
    const tokenOrg = req.user?.orgKey;
    const requestedOrg = (req.headers["x-org"] || req.query.org || "").trim();
    if (!tokenOrg) return res.status(403).json({ message: "Token missing org" });
    if (!requestedOrg) return res.status(400).json({ message: "x-org header required" });
    if (requestedOrg !== tokenOrg) {
      return res.status(403).json({ message: "Forbidden: org mismatch" });
    }
    next();
  } catch (e) {
    return res.status(500).json({ message: "Org enforcement error" });
  }
}

export default enforceOrgFromToken;


