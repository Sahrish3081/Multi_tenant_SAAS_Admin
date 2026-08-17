export function profileController(req, res) {
    return res.status(200).json({
        success: true,
        message: "Profile accessed successfully",
        user: req.user
    });
}