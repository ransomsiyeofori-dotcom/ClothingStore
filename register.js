
/* =========================================================
   THREADS CLOTHING CO.
   REGISTER PAGE
========================================================= */

"use strict";


/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
    window.THREADS_API_URL ||
    "http://localhost:5000/api";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const registerForm =
    document.getElementById("registerForm");

const registerButton =
    document.getElementById("registerButton");

const registerMessage =
    document.getElementById("registerMessage");

const firstNameInput =
    document.getElementById("firstName");

const lastNameInput =
    document.getElementById("lastName");

const emailInput =
    document.getElementById("email");

const phoneInput =
    document.getElementById("phone");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const termsInput =
    document.getElementById("terms");

const passwordStrength =
    document.getElementById("passwordStrength");

const strengthText =
    document.getElementById("strengthText");

const currentYear =
    document.getElementById("currentYear");


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeRegisterPage();

});


function initializeRegisterPage() {

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }

    initializePasswordToggles();

    initializePasswordStrength();

    initializeLiveValidation();

    initializeRegistrationForm();

}


/* =========================================================
   PASSWORD TOGGLES
========================================================= */

function initializePasswordToggles() {

    const passwordToggle =
        document.getElementById("passwordToggle");

    const confirmPasswordToggle =
        document.getElementById("confirmPasswordToggle");


    if (passwordToggle && passwordInput) {

        passwordToggle.addEventListener(
            "click",
            () => {

                togglePasswordVisibility(
                    passwordInput,
                    passwordToggle
                );

            }
        );

    }


    if (
        confirmPasswordToggle &&
        confirmPasswordInput
    ) {

        confirmPasswordToggle.addEventListener(
            "click",
            () => {

                togglePasswordVisibility(
                    confirmPasswordInput,
                    confirmPasswordToggle
                );

            }
        );

    }

}


function togglePasswordVisibility(
    input,
    button
) {

    const isPassword =
        input.type === "password";


    input.type =
        isPassword
            ? "text"
            : "password";


    button.setAttribute(
        "aria-label",
        isPassword
            ? "Hide password"
            : "Show password"
    );


    button.setAttribute(
        "aria-pressed",
        String(isPassword)
    );

}


/* =========================================================
   PASSWORD STRENGTH
========================================================= */

function initializePasswordStrength() {

    if (!passwordInput) {
        return;
    }


    passwordInput.addEventListener(
        "input",
        () => {

            const password =
                passwordInput.value.trim();


            if (!password) {

                if (passwordStrength) {
                    passwordStrength.hidden = true;
                }

                return;
            }


            if (passwordStrength) {
                passwordStrength.hidden = false;
            }


            const result =
                calculatePasswordStrength(password);


            if (passwordStrength) {

                passwordStrength.dataset.strength =
                    result.level;
            }


            if (strengthText) {

                strengthText.textContent =
                    result.label;
            }

        }
    );

}


function calculatePasswordStrength(password) {

    let score = 0;


    /* Length */

    if (password.length >= 8) {
        score++;
    }

    if (password.length >= 12) {
        score++;
    }


    /* Lowercase */

    if (/[a-z]/.test(password)) {
        score++;
    }


    /* Uppercase */

    if (/[A-Z]/.test(password)) {
        score++;
    }


    /* Number */

    if (/[0-9]/.test(password)) {
        score++;
    }


    /* Special character */

    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }


    if (score <= 2) {

        return {
            level: "weak",
            label: "Weak password"
        };

    }


    if (score <= 4) {

        return {
            level: "medium",
            label: "Medium password"
        };

    }


    return {
        level: "strong",
        label: "Strong password"
    };

}


/* =========================================================
   LIVE VALIDATION
========================================================= */

function initializeLiveValidation() {

    if (firstNameInput) {

        firstNameInput.addEventListener(
            "blur",
            () => validateFirstName()
        );

    }


    if (lastNameInput) {

        lastNameInput.addEventListener(
            "blur",
            () => validateLastName()
        );

    }


    if (emailInput) {

        emailInput.addEventListener(
            "blur",
            () => validateEmail()
        );

    }


    if (phoneInput) {

        phoneInput.addEventListener(
            "blur",
            () => validatePhone()
        );

    }


    if (passwordInput) {

        passwordInput.addEventListener(
            "blur",
            () => validatePassword()
        );

    }


    if (confirmPasswordInput) {

        confirmPasswordInput.addEventListener(
            "blur",
            () => validateConfirmPassword()
        );

    }


    if (termsInput) {

        termsInput.addEventListener(
            "change",
            () => {

                if (termsInput.checked) {
                    clearFieldError("terms");
                }

            }
        );

    }

}


/* =========================================================
   VALIDATION HELPERS
========================================================= */

function getErrorElement(fieldName) {

    return document.getElementById(
        `${fieldName}Error`
    );

}


function setFieldError(
    fieldName,
    message
) {

    const input =
        document.getElementById(fieldName);

    const error =
        getErrorElement(fieldName);


    if (input) {

        const field =
            input.closest(".form-field");

        if (field) {
            field.classList.add("has-error");
            field.classList.remove("has-success");
        }

        input.setAttribute(
            "aria-invalid",
            "true"
        );

    }


    if (error) {
        error.textContent = message;
    }


    return false;

}


function clearFieldError(fieldName) {

    const input =
        document.getElementById(fieldName);

    const error =
        getErrorElement(fieldName);


    if (input) {

        const field =
            input.closest(".form-field");

        if (field) {
            field.classList.remove("has-error");
        }

        input.removeAttribute(
            "aria-invalid"
        );

    }


    if (error) {
        error.textContent = "";
    }

}


function setFieldSuccess(fieldName) {

    const input =
        document.getElementById(fieldName);


    if (!input) {
        return;
    }


    const field =
        input.closest(".form-field");


    if (field) {

        field.classList.remove("has-error");

        field.classList.add(
            "has-success"
        );

    }


    input.removeAttribute(
        "aria-invalid"
    );

}


/* =========================================================
   FIELD VALIDATORS
========================================================= */

function validateFirstName() {

    if (!firstNameInput) {
        return true;
    }


    const value =
        firstNameInput.value.trim();


    if (!value) {

        return setFieldError(
            "firstName",
            "Please enter your first name."
        );

    }


    if (value.length < 2) {

        return setFieldError(
            "firstName",
            "First name must contain at least 2 characters."
        );

    }


    if (!/^[A-Za-zÀ-ÿ' -]+$/.test(value)) {

        return setFieldError(
            "firstName",
            "Please enter a valid first name."
        );

    }


    setFieldSuccess("firstName");

    return true;

}


function validateLastName() {

    if (!lastNameInput) {
        return true;
    }


    const value =
        lastNameInput.value.trim();


    if (!value) {

        return setFieldError(
            "lastName",
            "Please enter your last name."
        );

    }


    if (value.length < 2) {

        return setFieldError(
            "lastName",
            "Last name must contain at least 2 characters."
        );

    }


    if (!/^[A-Za-zÀ-ÿ' -]+$/.test(value)) {

        return setFieldError(
            "lastName",
            "Please enter a valid last name."
        );

    }


    setFieldSuccess("lastName");

    return true;

}


function validateEmail() {

    if (!emailInput) {
        return true;
    }


    const value =
        emailInput.value.trim();


    if (!value) {

        return setFieldError(
            "email",
            "Please enter your email address."
        );

    }


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


    if (!emailPattern.test(value)) {

        return setFieldError(
            "email",
            "Please enter a valid email address."
        );

    }


    setFieldSuccess("email");

    return true;

}


function validatePhone() {

    if (!phoneInput) {
        return true;
    }


    const value =
        phoneInput.value.trim();


    /*
       Phone is optional.
    */

    if (!value) {

        clearFieldError("phone");

        return true;

    }


    /*
       Accepts international and local-style
       phone numbers while preventing obvious
       invalid input.
    */

    const digits =
        value.replace(/\D/g, "");


    if (
        digits.length < 10 ||
        digits.length > 15
    ) {

        return setFieldError(
            "phone",
            "Please enter a valid phone number."
        );

    }


    setFieldSuccess("phone");

    return true;

}


function validatePassword() {

    if (!passwordInput) {
        return true;
    }


    const password =
        passwordInput.value;


    if (!password) {

        return setFieldError(
            "password",
            "Please create a password."
        );

    }


    if (password.length < 8) {

        return setFieldError(
            "password",
            "Password must contain at least 8 characters."
        );

    }


    if (!/[A-Z]/.test(password)) {

        return setFieldError(
            "password",
            "Password must contain at least one uppercase letter."
        );

    }


    if (!/[a-z]/.test(password)) {

        return setFieldError(
            "password",
            "Password must contain at least one lowercase letter."
        );

    }


    if (!/[0-9]/.test(password)) {

        return setFieldError(
            "password",
            "Password must contain at least one number."
        );

    }


    setFieldSuccess("password");

    return true;

}


function validateConfirmPassword() {

    if (!confirmPasswordInput) {
        return true;
    }


    const password =
        passwordInput
            ? passwordInput.value
            : "";

    const confirmPassword =
        confirmPasswordInput.value;


    if (!confirmPassword) {

        return setFieldError(
            "confirmPassword",
            "Please confirm your password."
        );

    }


    if (password !== confirmPassword) {

        return setFieldError(
            "confirmPassword",
            "Passwords do not match."
        );

    }


    setFieldSuccess("confirmPassword");

    return true;

}


function validateTerms() {

    if (!termsInput) {
        return true;
    }


    if (!termsInput.checked) {

        const error =
            document.getElementById(
                "termsError"
            );


        if (error) {
            error.textContent =
                "Please accept the Terms & Conditions.";
        }


        return false;

    }


    const error =
        document.getElementById(
            "termsError"
        );


    if (error) {
        error.textContent = "";
    }


    return true;

}


/* =========================================================
   FORM VALIDATION
========================================================= */

function validateRegistrationForm() {

    const firstNameValid =
        validateFirstName();

    const lastNameValid =
        validateLastName();

    const emailValid =
        validateEmail();

    const phoneValid =
        validatePhone();

    const passwordValid =
        validatePassword();

    const confirmPasswordValid =
        validateConfirmPassword();

    const termsValid =
        validateTerms();


    return (
        firstNameValid &&
        lastNameValid &&
        emailValid &&
        phoneValid &&
        passwordValid &&
        confirmPasswordValid &&
        termsValid
    );

}


/* =========================================================
   REGISTRATION FORM
========================================================= */

function initializeRegistrationForm() {

    if (!registerForm) {
        return;
    }


    registerForm.addEventListener(
        "submit",
        handleRegistration
    );

}


async function handleRegistration(event) {

    event.preventDefault();


    clearRegisterMessage();


    /*
       Validate before making API request.
    */

    const isValid =
        validateRegistrationForm();


    if (!isValid) {

        showRegisterMessage(
            "Please correct the highlighted fields and try again.",
            "error"
        );


        focusFirstInvalidField();

        return;

    }


    setRegisterLoading(true);


    const registrationData = {

        firstName:
            firstNameInput.value.trim(),

        lastName:
            lastNameInput.value.trim(),

        email:
            emailInput.value.trim().toLowerCase(),

        phone:
            phoneInput
                ? phoneInput.value.trim()
                : "",

        password:
            passwordInput.value,

        confirmPassword:
            confirmPasswordInput.value

    };


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    credentials: "include",

                    body:
                        JSON.stringify(
                            registrationData
                        )
                }
            );


        const data =
            await parseResponse(response);


        if (!response.ok) {

            throw new Error(
                getApiErrorMessage(
                    data,
                    response.status
                )
            );

        }


        /*
           Registration succeeded.
        */

        showRegisterMessage(
            data.message ||
            "Your account has been created successfully.",
            "success"
        );


        registerForm.reset();


        if (passwordStrength) {
            passwordStrength.hidden = true;
        }


        /*
           Give the user a moment to see
           the success message.
        */

        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 1200);


    } catch (error) {

        console.error(
            "THREADS registration error:",
            error
        );


        showRegisterMessage(
            getFriendlyRegistrationError(error),
            "error"
        );


    } finally {

        setRegisterLoading(false);

    }

}


/* =========================================================
   RESPONSE PARSER
========================================================= */

async function parseResponse(response) {

    const contentType =
        response.headers.get(
            "content-type"
        ) || "";


    if (
        contentType.includes(
            "application/json"
        )
    ) {

        return await response.json();

    }


    const text =
        await response.text();


    return {
        message: text
    };

}


/* =========================================================
   API ERROR MESSAGE
========================================================= */

function getApiErrorMessage(
    data,
    status
) {

    if (!data) {

        return (
            `Registration failed (${status}).`
        );

    }


    /*
       Common backend formats:
       { message: "..." }
       { error: "..." }
       { errors: [...] }
    */

    if (
        typeof data.message === "string" &&
        data.message.trim()
    ) {

        return data.message;

    }


    if (
        typeof data.error === "string" &&
        data.error.trim()
    ) {

        return data.error;

    }


    if (
        Array.isArray(data.errors) &&
        data.errors.length
    ) {

        return data.errors
            .map(error => {

                if (
                    typeof error === "string"
                ) {
                    return error;
                }

                return (
                    error.message ||
                    error.msg ||
                    "Invalid information."
                );

            })
            .join(" ");

    }


    if (status === 400) {

        return (
            "Some of the information provided is invalid."
        );

    }


    if (status === 409) {

        return (
            "An account with this email already exists."
        );

    }


    if (status >= 500) {

        return (
            "Something went wrong on our server. Please try again."
        );

    }


    return (
        "Registration could not be completed. Please try again."
    );

}


/* =========================================================
   FRIENDLY NETWORK ERRORS
========================================================= */

function getFriendlyRegistrationError(error) {

    if (
        error instanceof TypeError
    ) {

        return (
            "We couldn't connect to THREADS. Please check your internet connection or make sure the server is running."
        );

    }


    return (
        error.message ||
        "Registration failed. Please try again."
    );

}


/* =========================================================
   LOADING STATE
========================================================= */

function setRegisterLoading(isLoading) {

    if (!registerButton) {
        return;
    }


    registerButton.disabled =
        isLoading;


    registerButton.classList.toggle(
        "loading",
        isLoading
    );


    if (isLoading) {

        registerButton.setAttribute(
            "aria-busy",
            "true"
        );

    } else {

        registerButton.removeAttribute(
            "aria-busy"
        );

    }

}


/* =========================================================
   REGISTER MESSAGE
========================================================= */

function showRegisterMessage(
    message,
    type
) {

    if (!registerMessage) {
        return;
    }


    registerMessage.hidden = false;

    registerMessage.textContent =
        message;


    registerMessage.classList.remove(
        "error",
        "success"
    );


    registerMessage.classList.add(
        type
    );

}


function clearRegisterMessage() {

    if (!registerMessage) {
        return;
    }


    registerMessage.hidden = true;

    registerMessage.textContent = "";

    registerMessage.classList.remove(
        "error",
        "success"
    );

}


/* =========================================================
   FOCUS FIRST INVALID FIELD
========================================================= */

function focusFirstInvalidField() {

    const invalidField =
        registerForm.querySelector(
            "[aria-invalid='true']"
        );


    if (invalidField) {

        invalidField.focus();

        invalidField.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}


/* =========================================================
   EXPORT / DEBUG SUPPORT
========================================================= */

window.ThreadsRegister = {

    validate:
        validateRegistrationForm,

    calculatePasswordStrength:
        calculatePasswordStrength,

    apiBaseUrl:
        API_BASE_URL

};

