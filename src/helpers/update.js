const update = (content) => {
  // Get the app container
  const app = document.getElementById('app');
  // Replace the content with the new content
  app.innerHTML = content;
};

export default update;