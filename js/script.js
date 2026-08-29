// ========================================
// BLOGSPACE - MAIN JAVASCRIPT
// ========================================


document.addEventListener("DOMContentLoaded", function () {


    // ========================================
    // REGISTER
    // ========================================

    const registerForm =
        document.getElementById("registerForm");


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    document.getElementById("name")
                        .value.trim();


                const email =
                    document.getElementById("email")
                        .value.trim();


                const password =
                    document.getElementById("password")
                        .value.trim();


                const confirmPassword =
                    document.getElementById(
                        "confirm-password"
                    ).value.trim();


                // Check password
                if (password !== confirmPassword) {

                    alert("Passwords do not match.");

                    return;

                }


                // Get existing user
                const existingUser =
                    JSON.parse(
                        localStorage.getItem("user")
                    );


                // Check if email already exists
                if (
                    existingUser &&
                    existingUser.email === email
                ) {

                    alert(
                        "An account with this email already exists."
                    );

                    return;

                }


                // Create user
                const user = {

                    name: name,

                    email: email,

                    password: password

                };


                // Save user
                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );


                alert(
                    "Account created successfully!"
                );


                // Go to login
                window.location.href =
                    "login.html";

            }
        );

    }



    // ========================================
    // LOGIN
    // ========================================

    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const email =
                    document.getElementById("email")
                        .value.trim();


                const password =
                    document.getElementById("password")
                        .value.trim();


                // Get registered user
                const user =
                    JSON.parse(
                        localStorage.getItem("user")
                    );


                // No account
                if (!user) {

                    alert(
                        "No account found. Please register first."
                    );

                    return;

                }


                // Check credentials
                if (
                    email === user.email &&
                    password === user.password
                ) {

                    // Login successful

                    localStorage.setItem(
                        "loggedIn",
                        "true"
                    );


                    localStorage.setItem(
                        "userEmail",
                        email
                    );


                    alert(
                        "Login successful!"
                    );


                    // Open dashboard
                    window.location.href =
                        "dashboard.html";

                }

                else {

                    alert(
                        "Invalid email or password."
                    );

                }

            }
        );

    }



    // ========================================
    // CREATE / EDIT BLOG
    // ========================================

    const blogForm =
        document.getElementById("blogForm");


    if (blogForm) {

        const titleInput =
            document.getElementById("title");


        const categoryInput =
            document.getElementById("category");


        const contentInput =
            document.getElementById("content");


        const submitButton =
            blogForm.querySelector(
                "button[type='submit']"
            );


        // Get edit ID
        const params =
            new URLSearchParams(
                window.location.search
            );


        const editId =
            params.get("edit");


        let blogs =
            JSON.parse(
                localStorage.getItem("blogs")
            ) || [];


        // ========================================
        // EDIT MODE
        // ========================================

        if (editId) {

            const blog =
                blogs.find(function (item) {

                    return item.id == editId;

                });


            if (blog) {

                titleInput.value =
                    blog.title;


                categoryInput.value =
                    blog.category || "";


                contentInput.value =
                    blog.content;


                submitButton.textContent =
                    "Update Blog";

            }

        }


        // ========================================
        // SUBMIT BLOG
        // ========================================

        blogForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const title =
                    titleInput.value.trim();


                const category =
                    categoryInput.value.trim();


                const content =
                    contentInput.value.trim();


                // Validation

                if (
                    title === "" ||
                    content === ""
                ) {

                    alert(
                        "Please enter the blog title and content."
                    );

                    return;

                }


                blogs =
                    JSON.parse(
                        localStorage.getItem("blogs")
                    ) || [];


                // ========================================
                // UPDATE BLOG
                // ========================================

                if (editId) {

                    const blogIndex =
                        blogs.findIndex(
                            function (item) {

                                return item.id == editId;

                            }
                        );


                    if (blogIndex !== -1) {

                        blogs[blogIndex].title =
                            title;


                        blogs[blogIndex].category =
                            category;


                        blogs[blogIndex].content =
                            content;


                        localStorage.setItem(
                            "blogs",
                            JSON.stringify(blogs)
                        );


                        alert(
                            "Blog updated successfully!"
                        );


                        window.location.href =
                            "dashboard.html";


                        return;

                    }

                }


                // ========================================
                // CREATE NEW BLOG
                // ========================================

                const newBlog = {

                    id: Date.now(),

                    title: title,

                    category: category,

                    content: content,

                    status: "Published",

                    date:
                        new Date()
                            .toLocaleDateString()

                };


                blogs.push(newBlog);


                localStorage.setItem(
                    "blogs",
                    JSON.stringify(blogs)
                );


                alert(
                    "Blog published successfully!"
                );


                window.location.href =
                    "dashboard.html";

            }
        );

    }



    // ========================================
    // DASHBOARD
    // ========================================

    if (
        window.location.pathname.includes(
            "dashboard.html"
        )
    ) {

        loadDashboard();

    }

});



// ========================================
// LOAD DASHBOARD
// ========================================

function loadDashboard() {

    const blogs =
        JSON.parse(
            localStorage.getItem("blogs")
        ) || [];


    // Statistics

    const totalBlogs =
        blogs.length;


    const publishedBlogs =
        blogs.filter(function (blog) {

            return blog.status === "Published";

        }).length;


    const draftBlogs =
        blogs.filter(function (blog) {

            return blog.status === "Draft";

        }).length;


    const statCards =
        document.querySelectorAll(
            ".stat-card h3"
        );


    if (statCards.length >= 3) {

        statCards[0].textContent =
            totalBlogs;


        statCards[1].textContent =
            publishedBlogs;


        statCards[2].textContent =
            draftBlogs;

    }


    // Blog container

    const blogContainer =
        document.querySelector(
            ".blog-container"
        );


    if (!blogContainer) {

        return;

    }


    blogContainer.innerHTML = "";


    // No blogs

    if (blogs.length === 0) {

        blogContainer.innerHTML = `
            <p class="no-blogs">
                No blogs available.
                Create your first blog!
            </p>
        `;

        return;

    }


    // Display blogs

    blogs.forEach(function (blog) {

        const article =
            document.createElement(
                "article"
            );


        article.className =
            "blog-card";


        article.innerHTML = `

            <div class="blog-content">

                <span class="blog-status ${
                    blog.status === "Draft"
                        ? "draft"
                        : ""
                }">

                    ${escapeHTML(
                        blog.status
                    )}

                </span>


                <h3>
                    ${escapeHTML(
                        blog.title
                    )}
                </h3>


                <p>
                    ${escapeHTML(
                        blog.content
                    )}
                </p>


                <small>

                    Category:
                    ${escapeHTML(
                        blog.category ||
                        "General"
                    )}

                </small>


                <div class="blog-actions">

                    <a
                        href="view-blog.html?id=${blog.id}"
                        class="read-more"
                    >
                        View →
                    </a>


                    <a
                        href="create-blog.html?edit=${blog.id}"
                        class="edit-link"
                    >
                        Edit
                    </a>

                </div>

            </div>

        `;


        blogContainer.appendChild(
            article
        );

    });

}



// ========================================
// SECURITY HELPER
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}