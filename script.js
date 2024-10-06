document.querySelector(".status-update button").addEventListener("click", function() {
  const postContent = document.querySelector(".status-update textarea").value;
  if (postContent.trim() === "") return;

  const postContainer = document.createElement("div");
  postContainer.classList.add("post");

  const postHeader = document.createElement("div");
  postHeader.classList.add("post-header");

  const userImg = document.createElement("img");
  userImg.src = "profile-pic.jpg";
  userImg.alt = "User";

  const userName = document.createElement("h4");
  userName.textContent = "John Doe";

  postHeader.appendChild(userImg);
  postHeader.appendChild(userName);

  const postBody = document.createElement("p");
  postBody.textContent = postContent;

  postContainer.appendChild(postHeader);
  postContainer.appendChild(postBody);

  document.querySelector(".posts").prepend(postContainer);
  document.querySelector(".status-update textarea").value = "";
});
