async function main() {
    try {
        console.log("Fetching data...");
    } catch (error) {
    console.error("Failed to fetch data. Please try again later.");
    process.exit(1);
}
    }


main();
const usersURL = "https://jsonplaceholder.typicode.com/users";
const postsURL = "https://jsonplaceholder.typicode.com/posts";
const todosURL = "https://jsonplaceholder.typicode.com/todos";

const [usersResponse, postsResponse, todosResponse] = await Promise.all([
    fetch(usersURL),
    fetch(postsURL),
    fetch(todosURL)
]);
const users = await usersResponse.json();
const posts = await postsResponse.json();
const todos = await todosResponse.json();
const report = users.map(user => {
    const userPosts = posts.filter(post => post.userId === user.id);
    const completedTodos = todos.filter(
    todo => todo.userId === user.id && todo.completed
);
    const openTodos = todos.filter(
    todo => todo.userId === user.id && !todo.completed
);
    return {
    name: user.name,
    email: user.email,
    city: user.address.city,
    postCount: userPosts.length,
    completedTodos: completedTodos.length,
    openTodos: openTodos.length
};
})
