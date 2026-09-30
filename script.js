document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sidebar = document.getElementById("sidebar");
    const mobileMenu = document.getElementById("mobileMenu");

    const searchInput = document.getElementById("searchInput");

    const themeBtn = document.getElementById("themeBtn");
    const notificationBtn = document.getElementById("notificationBtn");
    const profileBtn = document.getElementById("profileBtn");

    const settingsBtn = document.getElementById("settingsBtn");
    const helpBtn = document.getElementById("helpBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const focusFromSidebar =
        document.getElementById("focusFromSidebar");

    const currentDate =
        document.getElementById("currentDate");

    const welcomeMessage =
        document.getElementById("welcomeMessage");

    /* Assignment */

    const addAssignmentBtn =
        document.getElementById("addAssignmentBtn");

    const assignmentForm =
        document.getElementById("assignmentForm");

    const assignmentName =
        document.getElementById("assignmentName");

    const assignmentSubject =
        document.getElementById("assignmentSubject");

    const assignmentDeadline =
        document.getElementById("assignmentDeadline");

    const assignmentPriority =
        document.getElementById("assignmentPriority");

    const saveAssignmentBtn =
        document.getElementById("saveAssignmentBtn");

    const cancelAssignmentBtn =
        document.getElementById("cancelAssignmentBtn");

    const assignmentList =
        document.getElementById("assignmentList");

    const emptyAssignment =
        document.getElementById("emptyAssignment");

    /* Progress */

    const pendingCount =
        document.getElementById("pendingCount");

    const overallProgress =
        document.getElementById("overallProgress");

    const bigProgress =
        document.getElementById("bigProgress");

    const circleProgress =
        document.getElementById("circleProgress");

    const completedCount =
        document.getElementById("completedCount");

    const progressPending =
        document.getElementById("progressPending");

    const progressMessage =
        document.getElementById("progressMessage");

    const sidebarCount =
        document.getElementById("sidebarCount");

    /* Timer */

    const timerDisplay =
        document.getElementById("timer");

    const startTimerBtn =
        document.getElementById("startTimer");

    const resetTimerBtn =
        document.getElementById("resetTimer");

    /* Quote */

    const quoteText =
        document.getElementById("quoteText");

    const newQuoteBtn =
        document.getElementById("newQuoteBtn");


    /* =====================================================
       VARIABLES
    ===================================================== */

    let assignments = [];

    let editingId = null;

    let searchText = "";

    let timerSeconds = 25 * 60;

    let timerInterval = null;

    let timerRunning = false;

    const assignmentStorage =
        "campusBuddyAssignments";

    const themeStorage =
        "campusBuddyTheme";


    /* =====================================================
       INITIALIZE
    ===================================================== */

    loadAssignments();

    setDate();

    setGreeting();

    renderAssignments();

    updateProgress();

    updateTimerDisplay();

    loadTheme();

    setupExtraStyles();


    /* =====================================================
       DATE
    ===================================================== */

    function setDate() {

        const today = new Date();

        currentDate.textContent =
            today.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });
    }


    /* =====================================================
       GREETING
    ===================================================== */

    function setGreeting() {

        const hour = new Date().getHours();

        let greeting = "Welcome back";

        if (hour < 12) {

            greeting = "Good Morning";

        } else if (hour < 17) {

            greeting = "Good Afternoon";

        } else {

            greeting = "Good Evening";
        }

        welcomeMessage.textContent =
            `${greeting}, Student! 👋`;
    }


    /* =====================================================
       LOAD ASSIGNMENTS
    ===================================================== */

    function loadAssignments() {

        const saved =
            localStorage.getItem(assignmentStorage);

        if (!saved) {

            assignments = [];

            return;
        }

        try {

            const data = JSON.parse(saved);

            assignments =
                Array.isArray(data) ? data : [];

        } catch (error) {

            console.error(error);

            assignments = [];
        }
    }


    /* =====================================================
       SAVE ASSIGNMENTS
    ===================================================== */

    function saveAssignments() {

        localStorage.setItem(
            assignmentStorage,
            JSON.stringify(assignments)
        );
    }


    /* =====================================================
       ADD BUTTON
    ===================================================== */

    addAssignmentBtn.addEventListener(
        "click",
        function () {

            editingId = null;

            clearForm();

            assignmentForm.classList.add("show");

            assignmentName.focus();
        }
    );


    /* =====================================================
       SAVE / UPDATE
    ===================================================== */

    saveAssignmentBtn.addEventListener(
        "click",
        function () {

            const name =
                assignmentName.value.trim();

            const subject =
                assignmentSubject.value;

            const deadline =
                assignmentDeadline.value;

            const priority =
                assignmentPriority.value;


            /* Validation */

            if (name === "") {

                showToast(
                    "Please enter assignment name.",
                    "error"
                );

                assignmentName.focus();

                return;
            }


            if (subject === "") {

                showToast(
                    "Please select a subject.",
                    "error"
                );

                assignmentSubject.focus();

                return;
            }


            if (deadline === "") {

                showToast(
                    "Please select a deadline.",
                    "error"
                );

                assignmentDeadline.focus();

                return;
            }


            /* UPDATE */

            if (editingId !== null) {

                const item =
                    assignments.find(
                        function (assignment) {
                            return assignment.id === editingId;
                        }
                    );


                if (item) {

                    item.name = name;
                    item.subject = subject;
                    item.deadline = deadline;
                    item.priority = priority;

                    saveAssignments();

                    renderAssignments();

                    updateProgress();

                    showToast(
                        "Assignment updated successfully! ✏️",
                        "success"
                    );
                }

            }

            /* ADD */

            else {

                const newAssignment = {

                    id: Date.now(),

                    name: name,

                    subject: subject,

                    deadline: deadline,

                    priority: priority,

                    completed: false
                };


                assignments.push(newAssignment);

                saveAssignments();

                renderAssignments();

                updateProgress();

                showToast(
                    "Assignment added successfully! 🎉",
                    "success"
                );
            }


            clearForm();

            assignmentForm.classList.remove("show");

            editingId = null;
        }
    );


    /* =====================================================
       CLEAR FORM
    ===================================================== */

    function clearForm() {

        assignmentName.value = "";

        assignmentSubject.value = "";

        assignmentDeadline.value = "";

        assignmentPriority.value = "Medium";

        editingId = null;

        saveAssignmentBtn.innerHTML = `
            <i class="fa-solid fa-check"></i>
            Save Assignment
        `;
    }


    /* =====================================================
       CANCEL
    ===================================================== */

    cancelAssignmentBtn.addEventListener(
        "click",
        function () {

            clearForm();

            assignmentForm.classList.remove("show");
        }
    );


    /* =====================================================
       RENDER ASSIGNMENTS
    ===================================================== */

    function renderAssignments() {

        assignmentList.innerHTML = "";


        let filtered =
            assignments.filter(function (item) {

                if (searchText === "") {

                    return true;
                }

                const search =
                    searchText.toLowerCase();

                return (

                    item.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    item.subject
                        .toLowerCase()
                        .includes(search)

                    ||

                    item.priority
                        .toLowerCase()
                        .includes(search)

                    ||

                    item.deadline
                        .includes(search)
                );
            });


        /* Pending first */

        filtered.sort(function (a, b) {

            if (a.completed !== b.completed) {

                return a.completed ? 1 : -1;
            }

            return (
                new Date(a.deadline) -
                new Date(b.deadline)
            );
        });


        /* No assignment */

        if (filtered.length === 0) {

            emptyAssignment.style.display = "block";


            if (assignments.length === 0) {

                emptyAssignment.innerHTML = `
                    <div>📝</div>

                    <h3>No assignments yet</h3>

                    <p>
                        Add your first assignment to get started.
                    </p>
                `;

            } else {

                emptyAssignment.innerHTML = `
                    <div>🔍</div>

                    <h3>No matching assignments</h3>

                    <p>
                        Try another search.
                    </p>
                `;
            }

            return;
        }


        emptyAssignment.style.display = "none";


        /* Create cards */

        filtered.forEach(function (item) {

            const card =
                document.createElement("div");

            card.className =
                "assignment-item";


            if (item.completed) {

                card.classList.add("completed");
            }


            const icon =
                getSubjectIcon(item.subject);

            const deadline =
                getDeadline(item.deadline);


            card.innerHTML = `

                <input
                    type="checkbox"
                    class="assignment-check"
                    ${item.completed ? "checked" : ""}
                    title="Complete assignment"
                >


                <div
                    class="assignment-icon ${icon.color}"
                >
                    <i class="${icon.icon}"></i>
                </div>


                <div class="assignment-details">

                    <div class="assignment-name">
                        ${escapeHTML(item.name)}
                    </div>

                    <div class="assignment-subject">
                        ${escapeHTML(item.subject)}
                    </div>

                    <div class="assignment-meta">

                        <span
                            class="deadline"
                            style="color:${deadline.color}"
                        >

                            <i class="fa-regular fa-calendar"></i>

                            ${deadline.text}

                        </span>


                        <span
                            class="priority ${item.priority.toLowerCase()}"
                        >
                            ${escapeHTML(item.priority)}
                        </span>

                    </div>

                </div>


                <div class="assignment-actions">

                    <button
                        class="edit-btn"
                        title="Edit Assignment"
                    >
                        <i class="fa-solid fa-pen"></i>
                    </button>


                    <button
                        class="delete-assignment-btn"
                        title="Delete Assignment"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>
            `;


            /* CHECKBOX */

            const checkbox =
                card.querySelector(
                    ".assignment-check"
                );


            checkbox.addEventListener(
                "change",
                function () {

                    item.completed =
                        checkbox.checked;

                    saveAssignments();

                    renderAssignments();

                    updateProgress();


                    if (item.completed) {

                        showToast(
                            "Assignment completed! 🎉",
                            "success"
                        );

                    } else {

                        showToast(
                            "Assignment marked as pending.",
                            "info"
                        );
                    }
                }
            );


            /* EDIT */

            const editButton =
                card.querySelector(".edit-btn");


            editButton.addEventListener(
                "click",
                function () {

                    editingId = item.id;

                    assignmentName.value =
                        item.name;

                    assignmentSubject.value =
                        item.subject;

                    assignmentDeadline.value =
                        item.deadline;

                    assignmentPriority.value =
                        item.priority;


                    assignmentForm.classList.add(
                        "show"
                    );


                    saveAssignmentBtn.innerHTML = `
                        <i class="fa-solid fa-pen"></i>
                        Update Assignment
                    `;


                    assignmentName.focus();

                    assignmentForm.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            );


            /* DELETE */

            const deleteButton =
                card.querySelector(
                    ".delete-assignment-btn"
                );


            deleteButton.addEventListener(
                "click",
                function () {

                    const answer =
                        confirm(
                            `Delete "${item.name}"?`
                        );


                    if (!answer) {

                        return;
                    }


                    assignments =
                        assignments.filter(
                            function (assignment) {

                                return (
                                    assignment.id !==
                                    item.id
                                );
                            }
                        );


                    saveAssignments();

                    renderAssignments();

                    updateProgress();

                    showToast(
                        "Assignment deleted successfully.",
                        "success"
                    );
                }
            );


            assignmentList.appendChild(card);
        });
    }


    /* =====================================================
       PROGRESS
    ===================================================== */

    function updateProgress() {

        const total =
            assignments.length;


        const completed =
            assignments.filter(
                function (item) {
                    return item.completed;
                }
            ).length;


        const pending =
            total - completed;


        let percentage = 0;


        if (total > 0) {

            percentage =
                Math.round(
                    completed / total * 100
                );
        }


        pendingCount.textContent =
            pending;

        overallProgress.textContent =
            percentage + "%";

        circleProgress.textContent =
            percentage + "%";

        completedCount.textContent =
            completed;

        progressPending.textContent =
            pending;

        sidebarCount.textContent =
            pending;


        bigProgress.style.background =
            `
            conic-gradient(
                #6957df 0% ${percentage}%,
                #eeeeF4 ${percentage}% 100%
            )
            `;


        if (total === 0) {

            progressMessage.textContent =
                "Start adding your assignments!";

        } else if (percentage === 100) {

            progressMessage.textContent =
                "Excellent! All assignments completed! 🎉";

        } else if (percentage >= 75) {

            progressMessage.textContent =
                "Amazing progress! Keep going! 💪";

        } else if (percentage >= 50) {

            progressMessage.textContent =
                "Great progress! Keep it up! 🚀";

        } else if (percentage >= 25) {

            progressMessage.textContent =
                "Good start! Stay consistent. 📚";

        } else {

            progressMessage.textContent =
                "One task at a time. You can do it! ✨";
        }
    }


    /* =====================================================
       SEARCH
    ===================================================== */

    searchInput.addEventListener(
        "input",
        function () {

            searchText =
                this.value.trim();

            renderAssignments();
        }
    );


    /* =====================================================
       DEADLINE
    ===================================================== */

    function getDeadline(dateString) {

        const deadline =
            new Date(
                dateString + "T23:59:59"
            );


        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        const tomorrow =
            new Date(today);

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );


        const formatted =
            deadline.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );


        if (deadline < today) {

            return {
                text:
                    "Overdue • " + formatted,

                color:
                    "#e05252"
            };
        }


        if (
            deadline.toDateString() ===
            today.toDateString()
        ) {

            return {
                text:
                    "Today • " + formatted,

                color:
                    "#e99a3e"
            };
        }


        if (
            deadline.toDateString() ===
            tomorrow.toDateString()
        ) {

            return {
                text:
                    "Tomorrow • " + formatted,

                color:
                    "#6957df"
            };
        }


        return {

            text:
                formatted,

            color:
                "#89899a"
        };
    }


    /* =====================================================
       SUBJECT ICON
    ===================================================== */

    function getSubjectIcon(subject) {

        const value =
            subject.toLowerCase();


        if (value.includes("web")) {

            return {
                icon:
                    "fa-solid fa-code",

                color:
                    "purple"
            };
        }


        if (value.includes("java")) {

            return {
                icon:
                    "fa-brands fa-java",

                color:
                    "blue"
            };
        }


        if (value.includes("artificial")) {

            return {
                icon:
                    "fa-solid fa-robot",

                color:
                    "orange"
            };
        }


        if (value.includes("database")) {

            return {
                icon:
                    "fa-solid fa-database",

                color:
                    "green"
            };
        }


        return {
            icon:
                "fa-solid fa-book",

            color:
                "purple"
        };
    }


    /* =====================================================
       TIMER
    ===================================================== */

    startTimerBtn.addEventListener(
        "click",
        function () {

            if (timerRunning) {

                pauseTimer();

            } else {

                startTimer();
            }
        }
    );


    function startTimer() {

        if (timerRunning) {

            return;
        }


        timerRunning = true;


        startTimerBtn.innerHTML = `
            <i class="fa-solid fa-pause"></i>
            Pause
        `;


        timerInterval =
            setInterval(
                function () {

                    if (timerSeconds > 0) {

                        timerSeconds--;

                        updateTimerDisplay();
                    }


                    if (timerSeconds === 0) {

                        clearInterval(
                            timerInterval
                        );

                        timerRunning = false;


                        startTimerBtn.innerHTML = `
                            <i class="fa-solid fa-play"></i>
                            Start
                        `;


                        showToast(
                            "🎉 Focus session completed!",
                            "success"
                        );


                        timerSeconds =
                            25 * 60;

                        updateTimerDisplay();
                    }

                },
                1000
            );
    }


    function pauseTimer() {

        clearInterval(timerInterval);

        timerRunning = false;


        startTimerBtn.innerHTML = `
            <i class="fa-solid fa-play"></i>
            Start
        `;


        showToast(
            "Timer paused.",
            "info"
        );
    }


    /* =====================================================
       RESET TIMER
    ===================================================== */

    resetTimerBtn.addEventListener(
        "click",
        function () {

            clearInterval(timerInterval);

            timerRunning = false;

            timerSeconds = 25 * 60;

            updateTimerDisplay();


            startTimerBtn.innerHTML = `
                <i class="fa-solid fa-play"></i>
                Start
            `;


            showToast(
                "Timer reset to 25:00.",
                "info"
            );
        }
    );


    function updateTimerDisplay() {

        const minutes =
            Math.floor(
                timerSeconds / 60
            );


        const seconds =
            timerSeconds % 60;


        timerDisplay.textContent =
            String(minutes).padStart(2, "0")
            +
            ":"
            +
            String(seconds).padStart(2, "0");
    }


    /* =====================================================
       START FOCUS FROM SIDEBAR
    ===================================================== */

    focusFromSidebar.addEventListener(
        "click",
        function () {

            const focusTimer =
                document.getElementById(
                    "focusTimer"
                );


            focusTimer.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });


            if (!timerRunning) {

                startTimer();
            }


            if (window.innerWidth <= 650) {

                sidebar.classList.remove(
                    "mobile-open"
                );
            }
        }
    );


    /* =====================================================
       DARK / LIGHT MODE
    ===================================================== */

    themeBtn.addEventListener(
        "click",
        function () {

            const isDark =
                document.body.classList.toggle(
                    "dark-mode"
                );


            if (isDark) {

                localStorage.setItem(
                    themeStorage,
                    "dark"
                );


                themeBtn.innerHTML = `
                    <i class="fa-solid fa-sun"></i>
                `;


                showToast(
                    "Dark mode enabled 🌙",
                    "info"
                );

            } else {

                localStorage.setItem(
                    themeStorage,
                    "light"
                );


                themeBtn.innerHTML = `
                    <i class="fa-solid fa-moon"></i>
                `;


                showToast(
                    "Light mode enabled ☀️",
                    "info"
                );
            }
        }
    );


    function loadTheme() {

        const theme =
            localStorage.getItem(
                themeStorage
            );


        if (theme === "dark") {

            document.body.classList.add(
                "dark-mode"
            );


            themeBtn.innerHTML = `
                <i class="fa-solid fa-sun"></i>
            `;

        } else {

            themeBtn.innerHTML = `
                <i class="fa-solid fa-moon"></i>
            `;
        }
    }


    /* =====================================================
       NOTIFICATION
    ===================================================== */

    notificationBtn.addEventListener(
        "click",
        function () {

            const pending =
                assignments.filter(
                    function (item) {
                        return !item.completed;
                    }
                ).length;


            if (pending === 0) {

                showToast(
                    "🎉 You're all caught up!",
                    "success"
                );

            } else {

                showToast(
                    `🔔 You have ${pending} pending assignment${pending > 1 ? "s" : ""}.`,
                    "info"
                );
            }
        }
    );


    /* =====================================================
       PROFILE
    ===================================================== */

    profileBtn.addEventListener(
        "click",
        function () {

            showToast(
                "👋 Student • B.Tech CSE Student",
                "info"
            );
        }
    );


    /* =====================================================
       SETTINGS
    ===================================================== */

    settingsBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showToast(
                "⚙️ Settings are ready for customization.",
                "info"
            );
        }
    );


    /* =====================================================
       HELP
    ===================================================== */

    helpBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showToast(
                "💡 Add assignments, track progress and use Focus Timer.",
                "info"
            );
        }
    );


    /* =====================================================
       SIGN OUT
    ===================================================== */

    logoutBtn.addEventListener(
        "click",
        function () {

            const answer =
                confirm(
                    "Are you sure you want to sign out?"
                );


            if (answer) {

                showToast(
                    "👋 Signed out successfully. This is a demo.",
                    "success"
                );
            }
        }
    );


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    mobileMenu.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "mobile-open"
            );
        }
    );


    /* =====================================================
       CLOSE MOBILE SIDEBAR
    ===================================================== */

    document.querySelectorAll(
        ".sidebar a"
    ).forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    if (
                        window.innerWidth <= 650
                    ) {

                        sidebar.classList.remove(
                            "mobile-open"
                        );
                    }
                }
            );
        }
    );


    /* =====================================================
       VIEW ALL BUTTONS
    ===================================================== */

    document.querySelectorAll(
        ".view-btn"
    ).forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const card =
                        button.closest(
                            ".content-card"
                        );


                    if (card) {

                        card.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }
                }
            );
        }
    );


    /* =====================================================
       MOTIVATIONAL QUOTES
    ===================================================== */

    const quotes = [

        "Success is the sum of small efforts repeated every day. 💪",

        "Believe in yourself and keep moving forward. 🌟",

        "Small progress is still progress. ✨",

        "Don't stop until you are proud of yourself. 🔥",

        "Your future depends on what you do today. 🚀",

        "Every expert was once a beginner. 💻",

        "Focus on your goal, not the obstacles. 🎯",

        "Consistency is more important than perfection. 📚",

        "Study hard today, enjoy your success tomorrow. 🎓",

        "One step at a time. You can do it! 💙",

        "Your hard work today will become your success tomorrow. 🌈",

        "Keep learning, keep growing, keep moving forward. 🚀"
    ];


    function newQuote() {

        const random =
            Math.floor(
                Math.random() * quotes.length
            );


        quoteText.textContent =
            `"${quotes[random]}"`;
    }


    newQuoteBtn.addEventListener(
        "click",
        function () {

            newQuote();

            showToast(
                "✨ New motivation!",
                "success"
            );
        }
    );


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(message, type) {

        const old =
            document.querySelector(
                ".campus-toast"
            );


        if (old) {

            old.remove();
        }


        const toast =
            document.createElement("div");


        toast.className =
            "campus-toast";


        let icon =
            "fa-circle-info";


        if (type === "success") {

            icon =
                "fa-circle-check";
        }


        if (type === "error") {

            icon =
                "fa-circle-exclamation";
        }


        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${escapeHTML(message)}</span>
        `;


        document.body.appendChild(
            toast
        );


        setTimeout(
            function () {

                toast.classList.add(
                    "hide"
                );


                setTimeout(
                    function () {

                        if (toast) {
                            toast.remove();
                        }

                    },
                    300
                );

            },
            2500
        );
    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       EXTRA CSS
    ===================================================== */

    function setupExtraStyles() {

        if (
            document.getElementById(
                "campusBuddyJSStyles"
            )
        ) {

            return;
        }


        const style =
            document.createElement("style");


        style.id =
            "campusBuddyJSStyles";


        style.textContent = `

            .campus-toast {

                position: fixed;

                right: 25px;

                bottom: 25px;

                z-index: 99999;

                display: flex;

                align-items: center;

                gap: 10px;

                max-width: 360px;

                padding: 13px 18px;

                border-radius: 10px;

                background: #25243c;

                color: white;

                font-family: Poppins, sans-serif;

                font-size: 12px;

                font-weight: 500;

                box-shadow:
                    0 10px 30px
                    rgba(0,0,0,0.20);

                animation:
                    campusToastIn
                    .3s ease;
            }


            .campus-toast i {

                color: #9184ff;

                font-size: 15px;
            }


            .campus-toast.hide {

                opacity: 0;

                transform:
                    translateY(15px);

                transition:
                    .3s ease;
            }


            @keyframes campusToastIn {

                from {

                    opacity: 0;

                    transform:
                        translateY(15px);
                }

                to {

                    opacity: 1;

                    transform:
                        translateY(0);
                }
            }


            body.dark-mode {

                background: #11131f;

                color: #f5f5f7;
            }


            body.dark-mode .topbar {

                background: #1b1e2b;

                border-bottom-color:
                    #2d3040;
            }


            body.dark-mode .content-card,

            body.dark-mode .date-box {

                background: #1b1e2b;

                color: white;
            }


            body.dark-mode .subject {

                background: #242837;

                border-color: #34384a;
            }


            body.dark-mode .assignment-item {

                background: #242837;

                border-color: #34384a;
            }


            body.dark-mode
            .assignment-item:hover {

                background: #2b2f40;
            }


            body.dark-mode
            .assignment-form {

                background: #202331;

                border-color: #34384a;
            }


            body.dark-mode
            .input-group input,

            body.dark-mode
            .input-group select {

                background: #292d3d;

                color: white;

                border-color: #3b4053;
            }


            body.dark-mode
            .input-group label {

                color: #b5b8c5;
            }


            body.dark-mode
            .assignment-name {

                color: white;
            }


            body.dark-mode
            .assignment-subject {

                color: #aeb2c0;
            }


            body.dark-mode
            .search-box {

                background: #292d3d;
            }


            body.dark-mode
            .search-box input {

                color: white;
            }


            body.dark-mode
            .search-box input::placeholder {

                color: #999dab;
            }


            body.dark-mode
            .progress-inner {

                background: #1b1e2b;
            }


            body.dark-mode
            .motivation {

                background: #252837;
            }


            body.dark-mode
            .quote-box {

                background:
                    linear-gradient(
                        135deg,
                        #29264b,
                        #252d48
                    );
            }


            body.dark-mode
            .progress-details strong {

                color: white;
            }


            body.dark-mode
            .empty-assignment h3 {

                color: white;
            }


            body.dark-mode
            .empty-assignment p {

                color: #aeb2c0;
            }

            body.dark-mode
            .stat-content h2 {

                color:black; 
            }


            @media (max-width: 650px) {

                .campus-toast {

                    left: 15px;

                    right: 15px;

                    bottom: 15px;

                    max-width: none;

                    font-size: 11px;
                }
            }

        `;


        document.head.appendChild(style);
    }


    /* =====================================================
       KEYBOARD SHORTCUTS
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            /* Ctrl + K = Search */

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                searchInput.focus();
            }


            /* Escape = close form */

            if (event.key === "Escape") {

                if (
                    assignmentForm.classList.contains(
                        "show"
                    )
                ) {

                    clearForm();

                    assignmentForm.classList.remove(
                        "show"
                    );
                }
            }
        }
    );

});