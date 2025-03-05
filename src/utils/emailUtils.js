import emailjs from "emailjs-com";

// EmailJS Credentials
const EMAILJS_SERVICE_ID = "service_vwkrvlo";
const EMAILJS_TEMPLATE_ID = "template_cp5wxfn";
const EMAILJS_USER_ID = "TOJoImRBiha538ZSU";

export const sendEmail = async (message) => {
    try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { message }, EMAILJS_USER_ID);
        console.log("📩 Email sent successfully!");
    } catch (error) {
        console.error("⚠️ Error sending email:", error);
    }
};
