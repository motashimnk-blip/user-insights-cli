import "dotenv/config"; // Automatically loads .env into process.env
const port = process.env.PORT ?? "3000";
const apiBaseUrl = process.env.API_BASE_URL ?? "https://jsonplaceholder.typicode.com";
console.log(`Server running on port ${port}`);
console.log(`Fetching from ${apiBaseUrl}`);
// --- Generic Utility Function ---
function groupBy(items, keyFn) {
    const result = {};
    for (const item of items) {
        const key = keyFn(item);
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(item);
    }
    return result;
}
// --- CLI Argument Parsing ---
function parseMinPostsArg() {
    const args = process.argv.slice(2);
    let minPosts = 0;
    for (const arg of args) {
        if (arg.startsWith("--min-posts=")) {
            const rawValue = arg.split("=")[1];
            const parsedValue = Number(rawValue);
            if (rawValue === undefined || rawValue === "" || Number.isNaN(parsedValue)) {
                console.error("Error: --min-posts requires a valid numeric value.");
                process.exit(1);
            }
            minPosts = parsedValue;
        }
    }
    return minPosts;
}
// --- Main Execution ---
async function main() {
    const minPostsThreshold = parseMinPostsArg();
    try {
        console.log("Fetching data...");
        const usersURL = "https://jsonplaceholder.typicode.com/users";
        const postsURL = "https://jsonplaceholder.typicode.com/posts";
        const todosURL = "https://jsonplaceholder.typicode.com/todos";
        const [usersResponse, postsResponse, todosResponse] = await Promise.all([
            fetch(usersURL),
            fetch(postsURL),
            fetch(todosURL),
        ]);
        if (!usersResponse.ok || !postsResponse.ok || !todosResponse.ok) {
            throw new Error("Failed to fetch one or more resources from the API.");
        }
        const users = (await usersResponse.json());
        const posts = (await postsResponse.json());
        const todos = (await todosResponse.json());
        // Grouping posts and todos by userId using the generic groupBy function
        const postsByUserId = groupBy(posts, (post) => String(post.userId));
        const todosByUserId = groupBy(todos, (todo) => String(todo.userId));
        let report = users.map((user) => {
            const userKey = String(user.id);
            const userPosts = postsByUserId[userKey] ?? [];
            const userTodos = todosByUserId[userKey] ?? [];
            const completedTodos = userTodos.filter((todo) => todo.completed);
            const openTodos = userTodos.filter((todo) => !todo.completed);
            return {
                name: user.name,
                email: user.email,
                city: user.address.city,
                postCount: userPosts.length,
                completedTodos: completedTodos.length,
                openTodos: openTodos.length,
            };
        });
        // Filter report by --min-posts threshold
        report = report.filter((user) => user.postCount >= minPostsThreshold);
        if (report.length === 0) {
            console.log(`\nNo users found with at least ${minPostsThreshold} posts.`);
            return;
        }
        // Sort by post count descending, then by name ascending
        report.sort((a, b) => {
            if (b.postCount !== a.postCount) {
                return b.postCount - a.postCount;
            }
            return a.name.localeCompare(b.name);
        });
        // Output individual reports
        report.forEach((user) => {
            console.log("----------------------------");
            console.log(`Name: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`City: ${user.city}`);
            console.log(`Posts: ${user.postCount}`);
            console.log(`Completed Todos: ${user.completedTodos}`);
            console.log(`Open Todos: ${user.openTodos}`);
        });
        // Summary calculations
        const totalUsers = report.length;
        const totalPosts = report.reduce((total, user) => total + user.postCount, 0);
        const averagePosts = totalUsers > 0 ? totalPosts / totalUsers : 0;
        // Guarantee report has items before reducing
        const firstUser = report[0];
        if (!firstUser) {
            console.log("No user data available.");
            return;
        }
        const mostCompleted = report.reduce((best, user) => {
            return user.completedTodos > best.completedTodos ? user : best;
        }, firstUser);
        console.log("\n===== Summary =====");
        console.log(`Total Users: ${totalUsers}`);
        console.log(`Total Posts: ${totalPosts}`);
        console.log(`Average Posts Per User: ${averagePosts.toFixed(2)}`);
        if (mostCompleted) {
            console.log(`Most Completed Todos: ${mostCompleted.name}`);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Failed to process report: ${error.message}`);
        }
        else {
            console.error("Failed to fetch data due to an unknown error.");
        }
        process.exit(1);
    }
}
void main();
//# sourceMappingURL=index.js.map