let hoverEl = document.getElementById('totalUsers');
let popup = document.getElementById('UsersPopup');
let totalUsersModal = new bootstrap.Modal(document.getElementById('totalUsersModal'));

hoverEl.addEventListener("mouseover", function(e) {
  popup.style.display = 'block';
});

hoverEl.addEventListener("mouseout", function(e) {
  popup.style.display = 'none';
});

function fadeOutEffect() {
  var fadeTarget = document.getElementById("copiedToClip");
  var fadeEffect = setInterval(function () {
      if (!fadeTarget.style.opacity) {
          fadeTarget.style.opacity = 1;
      }
      if (fadeTarget.style.opacity > 0) {
          fadeTarget.style.opacity -= 0.1;
      } else {
          clearInterval(fadeEffect);
      }
  }, 50);
}

function copyUserAddresses() {
  userAddresses.select();
  userAddresses.setSelectionRange(0, 999999);
  navigator.clipboard.writeText(userAddresses.value);

  document.getElementById('copiedToClip').style.display = 'flex';
  document.getElementById('copiedToClip').style.opacity = 1;
  setTimeout(function(){
    fadeOutEffect();
  } ,1000);
}