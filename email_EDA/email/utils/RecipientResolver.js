class RecipientResolver {
    static resolve(role, data) {
        if (!role || !data) return null;

        switch (role) {
            case "ADMIN":
                return process.env.ADMIN_EMAIL || "admin@dreamxec.com";
            case "STUDENT":
                return data.studentEmail || data.userEmail || data.email;
            case "STUDENT_PRESIDENT":
                return data.presidentEmail || data.email;
            case "DONOR":
                return data.donorEmail || data.email;
            default:
                // Fallback or custom logic if passed in data
                return data.to || data.email;
        }
    }
}

export default RecipientResolver;
