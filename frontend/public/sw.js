self.addEventListener("push", (event) => {
  const data = event.data.json();
  self.registration.showNotification("ManagePro", {
    body: data.message,
    icon: "/logo.png",
  });
});
