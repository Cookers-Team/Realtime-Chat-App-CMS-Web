const EmailPattern =
  /^(?!.*[.]{2,})[a-zA-Z0-9.%]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const PhonePattern = /^0[35789][0-9]{8}$/;

const StudentIdPattern = /^[1-9][0-9]{7}$/;

// const remoteUrl = "https://realtime-chat-app-api-1.onrender.com";
const remoteUrl = "http://localhost:7979";

export { EmailPattern, PhonePattern, remoteUrl, StudentIdPattern };
