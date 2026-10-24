"use strict";

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const STORAGE_KEY = "goldenRoyaleSocial_v1";

const defaultUsers = [
  {
    id: "u1",
    name: "Aarav Mehta",
    handle: "aaravcreates",
    bio: "Designer | Creating beautiful things",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
    following: false
  },
  {
    id: "u2",
    name: "Priya Sharma",
    handle: "priyastyle",
    bio: "Fashion, creativity and everyday inspiration",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
    following: true
  },
  {
    id: "u3",
    name: "Riya Kapoor",
    handle: "riyaart",
    bio: "Artist and visual storyteller",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=80",
    following: false
  },
  {
    id: "u4",
    name: "Kabir Rao",
    handle: "kabirtech",
    bio: "Technology enthusiast",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80",
    following: false
  }
];

const defaultProducts = [
  {
    id: "p1",
    name: "Golden Heritage Watch",
    price: 2499,
    category: "Accessories",
    description: "A timeless gold-tone accessory for everyday elegance.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
    icon: "⌚"
  },
  {
    id: "p2",
    name: "Classic Silk Scarf",
    price: 899,
    category: "Fashion",
    description: "A versatile fashion accessory with an elegant feel.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85",
    icon: "🧣"
  },
  {
    id: "p3",
    name: "Ceramic Decor Vase",
    price: 1299,
    category: "Home",
    description: "A refined decorative accent for your favourite space.",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=85",
    icon: "🏺"
  },
  {
    id: "p4",
    name: "Everyday Beauty Set",
    price: 1499,
    category: "Beauty",
    description: "A curated self-care collection for your daily routine.",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85",
    icon: "✨"
  },
  {
    id: "p5",
    name: "Wireless Headphones",
    price: 3299,
    category: "Technology",
    description: "A stylish everyday companion for your audio.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
    icon: "🎧"
  },
  {
    id: "p6",
    name: "Elegant Gold Earrings",
    price: 699,
    category: "Accessories",
    description: "A minimal accessory for special occasions and daily wear.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85",
    icon: "💎"
  }
];

const starterPosts = [
  {
    id: "post1",
    userId: "u1",
    author: "Aarav Mehta",
    handle: "aaravcreates",
    avatar: defaultUsers[0].image,
    text: "Great design begins with a simple idea and the courage to make it real. ✨ What are you creating this week? #CreativeMinds #Inspiration",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85",
    createdAt: Date.now() - 1000 * 60 * 18,
    likes: ["u2"],
    comments: [{ id: "c1", author: "Priya Sharma", text: "Absolutely love this reminder! ✨" }],
    tags: ["CreativeMinds", "Inspiration"]
  },
  {
    id: "post2",
    userId: "u2",
    author: "Priya Sharma",
    handle: "priyastyle",
    avatar: defaultUsers[1].image,
    text: "A little golden detail can make an everyday outfit feel special. Wear what makes you feel like yourself. 🌟 #RoyaleStyle",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85",
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
    likes: [],
    comments: [],
    tags: ["RoyaleStyle"]
  },
  {
    id: "post3",
    userId: "u3",
    author: "Riya Kapoor",
    handle: "riyaart",
    avatar: defaultUsers[2].image,
    text: "Taking a break, collecting ideas and finding inspiration in the little things. 🎨 #GoldenLiving",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=85",
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
    likes: ["u1", "u2"],
    comments: [],
    tags: ["GoldenLiving"]
  }
];

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (saved && Array.isArray(saved.posts)) {
      return {
        ...saved,
        user: saved.user || {
          name: "Bhargavi",
          handle: "bhargavi_raj",
          bio: "Welcome to my creative corner.",
          image: ""
        },
        users: Array.isArray(saved.users)
          ? saved.users.map(person => {
              const fallback = defaultUsers.find(user => user.id === person.id);
              return { ...fallback, ...person, image: person.image || fallback?.image || "" };
            })
          : structuredClone(defaultUsers),
        posts: saved.posts.map(post => {
          const fallback = starterPosts.find(item => item.id === post.id);
          return {
            ...post,
            avatar: post.avatar || fallback?.avatar || "",
            image: post.image || fallback?.image || "",
            likes: Array.isArray(post.likes) ? post.likes : [],
            comments: Array.isArray(post.comments) ? post.comments : [],
            tags: Array.isArray(post.tags) ? post.tags : []
          };
        }),
        products: Array.isArray(saved.products)
          ? saved.products.map(product => {
              const fallback = defaultProducts.find(item => item.id === product.id);
              return {
                ...product,
                image: product.image || fallback?.image || ""
              };
            })
          : structuredClone(defaultProducts),
        cart: Array.isArray(saved.cart) ? saved.cart : [],
        savedPosts: Array.isArray(saved.savedPosts) ? saved.savedPosts : [],
        notifications: Array.isArray(saved.notifications) ? saved.notifications : []
      };
    }
  } catch (error) {
    console.warn("Saved demo data could not be loaded.", error);
  }

  return {
    user: {
      name: "Bhargavi",
      handle: "bhargavi_raj",
      bio: "Welcome to my creative corner.",
      image: ""
    },
    users: structuredClone(defaultUsers),
    posts: structuredClone(starterPosts),
    products: structuredClone(defaultProducts),
    cart: [],
    savedPosts: [],
    notifications: [{
      id: "n1",
      text: "Welcome to Golden Royale! Discover the community and share your first post.",
      time: Date.now(),
      read: false
    }]
  };
}

let state = loadState();
let currentView = "feed";
let searchQuery = "";
let toastTimer;

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    showToast("Browser storage is full. Some changes may not persist.");
  }
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function safeImageURL(value) {
  try {
    const url = new URL(value, location.href);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function avatarHTML(name, image = "", extraClass = "") {
  const url = safeImageURL(image);
  const initial = escapeHTML((name || "R").trim().charAt(0).toUpperCase());

  return `<div class="avatar ${extraClass}">${
    url
      ? `<img src="${escapeHTML(url)}" alt="${escapeHTML(name)}" loading="lazy" onerror="this.style.display='none'; this.parentElement.textContent='${initial}'">`
      : initial
  }</div>`;
}

function formatTime(timestamp) {
  const elapsed = Math.max(0, Date.now() - timestamp);
  if (elapsed < 60000) return "Just now";
  if (elapsed < 3600000) return `${Math.floor(elapsed / 60000)}m ago`;
  if (elapsed < 86400000) return `${Math.floor(elapsed / 3600000)}h ago`;
  return new Date(timestamp).toLocaleDateString();
}

function formatMoney(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function addNotification(text) {
  state.notifications.unshift({
    id: crypto.randomUUID(),
    text,
    time: Date.now(),
    read: false
  });
  state.notifications = state.notifications.slice(0, 50);
}

function openDialog(id) {
  const dialog = document.getElementById(id);
  if (dialog && !dialog.open) dialog.showModal();
}

function closeDialog(id) {
  const dialog = document.getElementById(id);
  if (dialog?.open) dialog.close();
}

// Profile
function renderProfile() {
  const user = state.user;
  const avatar = avatarHTML(user.name, user.image, "avatar-large");

  $("#sideAvatar").innerHTML = avatar.replace(/^<div[^>]*>|<\/div>$/g, "");
  $("#sideAvatar").className = "avatar avatar-large";
  $("#sideName").textContent = user.name;
  $("#sideHandle").textContent = "@" + user.handle;

  $("#profileBtn").innerHTML = avatarHTML(user.name, user.image)
    .replace('class="avatar"', 'class="avatar profile-avatar"')
    .replace(/^<div[^>]*>|<\/div>$/g, "");

  $("#composerAvatar").innerHTML = avatarHTML(user.name, user.image)
    .replace(/^<div[^>]*>|<\/div>$/g, "");

  $("#postCount").textContent = state.posts.filter(post => post.userId === "me").length;
  $("#followingCount").textContent = state.users.filter(person => person.following).length;
}

function editProfile() {
  $("#profileName").value = state.user.name;
  $("#profileHandle").value = state.user.handle;
  $("#profileBio").value = state.user.bio || "";
  $("#profileImage").value = state.user.image || "";
  openDialog("profileDialog");
}

$("#profileBtn").addEventListener("click", editProfile);
$("#mobileProfile").addEventListener("click", editProfile);

$("#profileForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = $("#profileName").value.trim();
  const handle = $("#profileHandle").value.trim().replace(/^@/, "");
  const image = $("#profileImage").value.trim();

  if (!name || !/^[A-Za-z0-9_]{2,24}$/.test(handle)) {
    showToast("Enter a name and a valid username.");
    return;
  }

  if (image && !safeImageURL(image)) {
    showToast("Please enter a valid HTTP or HTTPS image URL.");
    return;
  }

  state.user = {
    name,
    handle,
    bio: $("#profileBio").value.trim(),
    image: safeImageURL(image)
  };

  state.posts.forEach(post => {
    if (post.userId === "me") {
      post.author = name;
      post.handle = handle;
      post.avatar = state.user.image;
    }
  });

  saveState();
  renderAll();
  closeDialog("profileDialog");
  showToast("Profile updated successfully!");
});

// Stories
function renderStories() {
  const stories = [
    { name: "Your story", image: state.user.image, own: true },
    ...state.users.map(person => ({ ...person, own: false }))
  ];

  $("#storiesRow").innerHTML = stories.map(person => `
    <button class="story ${person.own ? "add-story" : ""}" data-story="${escapeHTML(person.name)}">
      <div class="story-ring">
        ${person.own
          ? `<div class="avatar">＋</div>`
          : avatarHTML(person.name, person.image)}
      </div>
      <small>${escapeHTML(person.name)}</small>
    </button>
  `).join("");
}

$("#storiesRow").addEventListener("click", event => {
  const button = event.target.closest("[data-story]");
  if (!button) return;

  if (button.dataset.story === "Your story") {
    openComposer();
  } else {
    showToast(`${button.dataset.story}'s demo story.`);
  }
});

$("#addStoryBtn").addEventListener("click", openComposer);

function openComposer() {
  currentView = "feed";
  showView("feed");
  $("#postForm").classList.add("open");
  $("#postText").focus();
}

$("#composerPrompt").addEventListener("click", openComposer);
$("#sidebarCreate").addEventListener("click", openComposer);
$("#heroCreate").addEventListener("click", openComposer);
$("#mobileCreate").addEventListener("click", openComposer);

$("#postText").addEventListener("input", () => {
  $("#charCount").textContent = `${$("#postText").value.length} / 1000`;
});

// Create a post
$("#postForm").addEventListener("submit", event => {
  event.preventDefault();

  const text = $("#postText").value.trim();
  const image = $("#postImage").value.trim();

  if (!text) {
    showToast("Write something before publishing.");
    return;
  }

  if (image && !safeImageURL(image)) {
    showToast("Enter a valid HTTP or HTTPS image URL.");
    return;
  }

  const tags = [...text.matchAll(/#([A-Za-z0-9_]+)/g)].map(match => match[1]);

  state.posts.unshift({
    id: crypto.randomUUID(),
    userId: "me",
    author: state.user.name,
    handle: state.user.handle,
    avatar: state.user.image,
    text,
    image: safeImageURL(image),
    createdAt: Date.now(),
    likes: [],
    comments: [],
    tags
  });

  saveState();
  $("#postForm").reset();
  $("#charCount").textContent = "0 / 1000";
  $("#postForm").classList.remove("open");
  currentView = "feed";
  renderAll();
  showToast("Your post has been published!");
});

// Feed
function getVisiblePosts() {
  let posts = [...state.posts];

  if (currentView === "following") {
    const followedIds = new Set(
      state.users.filter(person => person.following).map(person => person.id)
    );
    posts = posts.filter(post => post.userId === "me" || followedIds.has(post.userId));
  }

  if (currentView === "saved") {
    posts = posts.filter(post => state.savedPosts.includes(post.id));
  }

  if (currentView === "explore") {
    posts.sort((a, b) => b.likes.length - a.likes.length);
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    posts = posts.filter(post =>
      `${post.author} ${post.handle} ${post.text} ${(post.tags || []).join(" ")}`
        .toLowerCase().includes(query)
    );
  }

  if ($("#sortPosts").value === "popular") {
    posts.sort((a, b) => b.likes.length - a.likes.length);
  } else if (currentView !== "explore") {
    posts.sort((a, b) => b.createdAt - a.createdAt);
  }

  return posts;
}

function renderPost(post) {
  const liked = post.likes.includes("me");
  const saved = state.savedPosts.includes(post.id);
  const isOwn = post.userId === "me";
  const image = safeImageURL(post.image);
  const tags = (post.tags || []).map(tag =>
    `<span>#${escapeHTML(tag)}</span>`
  ).join(" ");

  return `
    <article class="post-card panel" data-post-id="${escapeHTML(post.id)}">
      <div class="post-header">
        ${avatarHTML(post.author, post.avatar)}
        <div class="post-user">
          <strong>${escapeHTML(post.author)}</strong>
          <small>@${escapeHTML(post.handle)} · ${formatTime(post.createdAt)}</small>
        </div>
        <button class="post-menu" data-action="${isOwn ? "delete" : "report"}" aria-label="Post options">⋯</button>
      </div>

      <p class="post-text">${escapeHTML(post.text)}</p>

      ${image ? `<img class="post-image" src="${escapeHTML(image)}" alt="Post image" loading="lazy" onerror="this.remove()">` : ""}
      ${tags ? `<div class="post-tags">${tags}</div>` : ""}

      <div class="post-stats">
        <span>♡ ${post.likes.length} ${post.likes.length === 1 ? "like" : "likes"}</span>
        <span>${post.comments.length} comments</span>
      </div>

      <div class="post-actions">
        <button class="action-btn ${liked ? "liked" : ""}" data-action="like">${liked ? "♥ Liked" : "♡ Like"}</button>
        <button class="action-btn" data-action="comment">▢ Comment</button>
        <button class="action-btn" data-action="save">${saved ? "⚑ Saved" : "⚑ Save"}</button>
        <button class="action-btn" data-action="share">↗ Share</button>
      </div>

      <div class="comment-area hidden">
        <div class="comment-list">
          ${post.comments.map(comment => `
            <div class="comment"><strong>${escapeHTML(comment.author)}</strong>${escapeHTML(comment.text)}</div>
          `).join("")}
        </div>
        <form class="comment-form">
          <input name="comment" maxlength="300" placeholder="Write a thoughtful comment..." required>
          <button type="submit">Send</button>
        </form>
      </div>
    </article>
  `;
}

function renderPosts() {
  const posts = getVisiblePosts();

  $("#postsContainer").innerHTML = posts.map(renderPost).join("");
  $("#emptyState").classList.toggle("hidden", posts.length !== 0);
  $("#postsContainer").classList.toggle("hidden", posts.length === 0);
}

$("#postsContainer").addEventListener("click", async event => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const card = button.closest("[data-post-id]");
  const post = state.posts.find(item => item.id === card?.dataset.postId);
  if (!post) return;

  const action = button.dataset.action;

  if (action === "like") {
    const index = post.likes.indexOf("me");

    if (index >= 0) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push("me");
      if (post.userId !== "me") addNotification(`You liked ${post.author}'s post.`);
    }

    saveState();
    renderPosts();
  }

  if (action === "comment") {
    const area = card.querySelector(".comment-area");
    area.classList.toggle("hidden");
    if (!area.classList.contains("hidden")) area.querySelector("input")?.focus();
  }

  if (action === "save") {
    if (state.savedPosts.includes(post.id)) {
      state.savedPosts = state.savedPosts.filter(id => id !== post.id);
      showToast("Post removed from saved items.");
    } else {
      state.savedPosts.push(post.id);
      showToast("Post saved!");
    }

    saveState();
    renderPosts();
  }

  if (action === "share") {
    const shareText = `${post.text}\n— ${post.author} (@${post.handle})`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "Golden Royale post", text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        showToast("Post text copied to clipboard!");
      }
    } catch (error) {
      if (error.name !== "AbortError") showToast("Unable to share this post.");
    }
  }

  if (action === "delete") {
    if (!confirm("Delete this post? This cannot be undone.")) return;

    state.posts = state.posts.filter(item => item.id !== post.id);
    state.savedPosts = state.savedPosts.filter(id => id !== post.id);
    saveState();
    renderAll();
    showToast("Post deleted.");
  }

  if (action === "report") {
    showToast("Demo only: reporting is not connected to a server.");
  }
});

$("#postsContainer").addEventListener("submit", event => {
  if (!event.target.matches(".comment-form")) return;
  event.preventDefault();

  const card = event.target.closest("[data-post-id]");
  const post = state.posts.find(item => item.id === card.dataset.postId);
  const text = event.target.elements.comment.value.trim();

  if (!post || !text) return;

  post.comments.push({
    id: crypto.randomUUID(),
    author: state.user.name,
    text
  });

  saveState();
  renderPosts();

  const updatedCard = $(`[data-post-id="${CSS.escape(post.id)}"]`);
  updatedCard?.querySelector(".comment-area")?.classList.remove("hidden");
  showToast("Comment added!");
});

$("#sortPosts").addEventListener("change", renderPosts);

// Search
$("#globalSearch").addEventListener("input", event => {
  searchQuery = event.target.value.trim();
  currentView = searchQuery ? "explore" : "feed";
  showView(currentView);
  renderAll();
});

$("#productSearch").addEventListener("input", renderProducts);
$("#productCategory").addEventListener("change", renderProducts);

// Navigation
function showView(view) {
  currentView = view;

  const marketplace = view === "marketplace";
  $("#marketplaceSection").classList.toggle("hidden", !marketplace);
  $("#composer").classList.toggle("hidden", marketplace || view === "saved");
  $("#feedHeading").classList.toggle("hidden", marketplace);

  $("#feedTitle").textContent = ({
    feed: "Community Feed",
    explore: "Explore Community",
    following: "Following",
    saved: "Saved Posts",
    marketplace: "Marketplace"
  })[view] || "Community Feed";

  $("#feedSubtitle").textContent = ({
    feed: "Fresh inspiration from your community",
    explore: "Discover ideas and creators",
    following: "Posts from people you follow",
    saved: "Your bookmarked inspiration",
    marketplace: "Discover community products"
  })[view] || "";

  $("#postsContainer").classList.toggle("hidden", marketplace);
  $("#emptyState").classList.toggle("hidden", marketplace);

  $$(".nav-item, .mobile-nav button[data-view]").forEach(button => {
    button.classList.toggle("active", button.dataset.view === view);
  });

  if (view === "notifications") {
    renderNotifications();
    openDialog("notificationDialog");
  }

  renderPosts();
}

$$("[data-view]").forEach(button => {
  button.addEventListener("click", () => {
    searchQuery = "";
    $("#globalSearch").value = "";
    showView(button.dataset.view);
    renderAll();
  });
});

$("#exploreMarketBtn").addEventListener("click", () => {
  searchQuery = "";
  $("#globalSearch").value = "";
  showView("marketplace");
  renderAll();
});

// Suggested users and following
function renderSuggestedUsers() {
  $("#suggestedUsers").innerHTML = state.users.map(person => `
    <div class="suggested-user">
      ${avatarHTML(person.name, person.image)}
      <div class="suggested-info">
        <strong>${escapeHTML(person.name)}</strong>
        <small>@${escapeHTML(person.handle)}</small>
      </div>
      <button class="follow-btn ${person.following ? "following" : ""}" data-follow="${escapeHTML(person.id)}">
        ${person.following ? "Following" : "Follow"}
      </button>
    </div>
  `).join("");
}

$("#suggestedUsers").addEventListener("click", event => {
  const button = event.target.closest("[data-follow]");
  if (!button) return;

  const person = state.users.find(user => user.id === button.dataset.follow);
  if (!person) return;

  person.following = !person.following;

  if (person.following) addNotification(`You are now following ${person.name}.`);

  saveState();
  renderAll();
  showToast(person.following ? `Following ${person.name}!` : `Unfollowed ${person.name}.`);
});

// Marketplace
function renderProducts() {
  const query = ($("#productSearch").value || "").trim().toLowerCase();
  const category = $("#productCategory").value || "all";

  const products = state.products.filter(product => {
    const matchesCategory = category === "all" || product.category === category;
    const matchesQuery = `${product.name} ${product.description} ${product.category}`
      .toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });

  $("#productGrid").innerHTML = products.map(product => {
    const image = safeImageURL(product.image);

    return `
      <article class="product-card">
        <div class="product-picture">
          ${image
            ? `<img src="${escapeHTML(image)}" alt="${escapeHTML(product.name)}" loading="lazy" onerror="this.remove(); this.parentElement.insertAdjacentHTML('afterbegin', '<span>✧</span>')">`
            : `<span>${escapeHTML(product.icon || "✧")}</span>`}
          <span class="product-badge">${escapeHTML(product.category)}</span>
        </div>
        <div class="product-info">
          <small>✦ ROYALE FIND</small>
          <h3>${escapeHTML(product.name)}</h3>
          <p>${escapeHTML(product.description)}</p>
          <div class="product-bottom">
            <strong>${formatMoney(product.price)}</strong>
            <button class="add-cart" data-add-cart="${escapeHTML(product.id)}">＋ Add</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  if (products.length === 0) {
    $("#productGrid").innerHTML = '<p class="muted">No matching products found.</p>';
  }

  renderCartSummary();
}

$("#productGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-add-cart]");
  if (!button) return;

  const product = state.products.find(item => item.id === button.dataset.addCart);
  if (!product) return;

  state.cart.push(product.id);
  saveState();
  renderCartSummary();
  showToast(`${product.name} added to your bag!`);
});

function getCartProducts() {
  return state.cart.map(id => state.products.find(product => product.id === id)).filter(Boolean);
}

function renderCartSummary() {
  const products = getCartProducts();
  const total = products.reduce((sum, product) => sum + Number(product.price), 0);

  $("#cartDetails").textContent = `${products.length} item${products.length === 1 ? "" : "s"} added`;
  $("#cartTotal").textContent = formatMoney(total);
  $("#dialogCartTotal").textContent = formatMoney(total);
}

$("#addProductBtn").addEventListener("click", () => openDialog("productDialog"));

$("#productForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = $("#newProductName").value.trim();
  const price = Number($("#newProductPrice").value);
  const image = $("#newProductImage").value.trim();
  const category = $("#newProductCategory").value;
  const description = $("#newProductDescription").value.trim();

  if (!name || !Number.isFinite(price) || price <= 0 || !description) {
    showToast("Enter a valid product name, price and description.");
    return;
  }

  if (image && !safeImageURL(image)) {
    showToast("Enter a valid HTTP or HTTPS image URL.");
    return;
  }

  state.products.unshift({
    id: crypto.randomUUID(),
    name,
    price,
    category,
    description,
    image: safeImageURL(image),
    icon: ({ Fashion: "👗", Accessories: "💎", Home: "🏺", Technology: "🎧", Beauty: "✨" })[category] || "✧"
  });

  saveState();
  $("#productForm").reset();
  closeDialog("productDialog");
  renderProducts();
  showToast("Your product has been listed!");
});

$("#viewCartBtn").addEventListener("click", () => {
  renderCartDialog();
  openDialog("cartDialog");
});

function renderCartDialog() {
  const products = getCartProducts();

  $("#cartItems").innerHTML = products.length
    ? products.map((product, index) => `
      <div class="cart-row">
        <div class="cart-row-info">
          <strong>${escapeHTML(product.name)}</strong>
          <small>${formatMoney(product.price)}</small>
        </div>
        <button data-remove-cart="${index}">Remove</button>
      </div>
    `).join("")
    : '<p class="muted">Your shopping bag is empty. Discover something special!</p>';

  renderCartSummary();
}

$("#cartItems").addEventListener("click", event => {
  const button = event.target.closest("[data-remove-cart]");
  if (!button) return;

  state.cart.splice(Number(button.dataset.removeCart), 1);
  saveState();
  renderCartDialog();
  renderProducts();
});

$("#checkoutBtn").addEventListener("click", () => {
  if (!state.cart.length) {
    showToast("Your shopping bag is empty.");
    return;
  }

  showToast("Demo only: payment and checkout are not connected.");
});

// Notifications
function renderNotifications() {
  const notifications = state.notifications;
  $("#notificationCount").textContent = notifications.filter(item => !item.read).length;

  $("#notificationList").innerHTML = notifications.length
    ? notifications.map(item => `
      <div class="notification-entry ${item.read ? "" : "unread"}">
        ${escapeHTML(item.text)}
        <small>${formatTime(item.time)}</small>
      </div>
    `).join("")
    : '<p class="muted">You are all caught up!</p>';
}

$("#notificationBtn").addEventListener("click", () => {
  renderNotifications();
  openDialog("notificationDialog");
});

$("#markReadBtn").addEventListener("click", () => {
  state.notifications.forEach(item => item.read = true);
  saveState();
  renderNotifications();
  showToast("All notifications marked as read.");
});

// Theme
$("#themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const dark = document.body.classList.contains("dark");
  $("#themeBtn").textContent = dark ? "☀" : "☾";

  try {
    localStorage.setItem("goldenRoyaleTheme", dark ? "dark" : "light");
  } catch {}
});

// Dialog close buttons
$$("[data-close]").forEach(button => {
  button.addEventListener("click", () => closeDialog(button.dataset.close));
});

$$("dialog").forEach(dialog => {
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
});

// Render everything
function renderAll() {
  renderProfile();
  renderStories();
  renderPosts();
  renderSuggestedUsers();
  renderProducts();
  renderNotifications();
}

// Restore saved theme
try {
  if (localStorage.getItem("goldenRoyaleTheme") === "dark") {
    document.body.classList.add("dark");
    $("#themeBtn").textContent = "☀";
  }
} catch {}

renderAll();
