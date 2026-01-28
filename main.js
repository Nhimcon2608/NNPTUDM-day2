// ==================== LOAD DATA ====================
async function LoadData() {
    let postsRes = await fetch("http://localhost:3000/posts");
    let posts = await postsRes.json();
    
    let commentsRes = await fetch("http://localhost:3000/comments");
    let comments = await commentsRes.json();
    
    let body = document.getElementById("body_table");
    body.innerHTML = '';
    
    for (const post of posts) {
        const isDeleted = post.isDeleted === true;
        const style = isDeleted ? 'text-decoration: line-through; color: gray;' : '';
        
        // Post row
        body.innerHTML += `<tr style="${style}">
            <td><strong>${post.id}</strong></td>
            <td><strong>${post.title}</strong></td>
            <td>${post.views}</td>
            <td>
                ${isDeleted 
                    ? `<input type="button" value="Restore" onclick="RestorePost('${post.id}')"/>`
                    : `<input type="button" value="Edit" onclick="EditPost('${post.id}')"/>
                       <input type="button" value="Delete" onclick="DeletePost('${post.id}')"/>
                       <input type="button" class="add-comment-btn" value="+ Comment" onclick="AddCommentToPost('${post.id}')"/>`
                }
            </td>
        </tr>`;
        
        // Comments for this post
        const postComments = comments.filter(c => c.postId === post.id);
        for (const comment of postComments) {
            body.innerHTML += `<tr class="comment-row">
                <td>↳ ${comment.id}</td>
                <td class="comment-text">${comment.text}</td>
                <td>Post #${comment.postId}</td>
                <td>
                    <input type="button" value="Edit" onclick="EditComment('${comment.id}')"/>
                    <input type="button" value="Delete" onclick="DeleteComment('${comment.id}')"/>
                </td>
            </tr>`;
        }
    }
}

// ==================== POSTS ====================
async function getMaxPostId() {
    let res = await fetch("http://localhost:3000/posts");
    let posts = await res.json();
    let maxId = 0;
    for (const post of posts) {
        const id = parseInt(post.id) || 0;
        if (id > maxId) maxId = id;
    }
    return maxId;
}

async function SavePost() {
    let id = document.getElementById("id_txt").value;
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("view_txt").value;

    if (id) {
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id, title: title, views: views, isDeleted: false })
        });
        if (res.ok) console.log("Cập nhật thành công");
    } else {
        let newId = (await getMaxPostId() + 1).toString();
        let res = await fetch('http://localhost:3000/posts', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: newId, title: title, views: views, isDeleted: false })
        });
        if (res.ok) console.log("Tạo mới thành công với ID: " + newId);
    }
    ClearPostForm();
    LoadData();
}

async function DeletePost(id) {
    let getRes = await fetch('http://localhost:3000/posts/' + id);
    let post = await getRes.json();
    
    let res = await fetch("http://localhost:3000/posts/" + id, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, isDeleted: true })
    });
    if (res.ok) console.log("Xoá mềm thành công");
    LoadData();
}

async function RestorePost(id) {
    let getRes = await fetch('http://localhost:3000/posts/' + id);
    let post = await getRes.json();
    
    let res = await fetch("http://localhost:3000/posts/" + id, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, isDeleted: false })
    });
    if (res.ok) console.log("Khôi phục thành công");
    LoadData();
}

async function EditPost(id) {
    let res = await fetch('http://localhost:3000/posts/' + id);
    let post = await res.json();
    document.getElementById("id_txt").value = post.id;
    document.getElementById("title_txt").value = post.title;
    document.getElementById("view_txt").value = post.views;
}

function ClearPostForm() {
    document.getElementById("id_txt").value = '';
    document.getElementById("title_txt").value = '';
    document.getElementById("view_txt").value = '';
}

// ==================== COMMENTS ====================
async function getMaxCommentId() {
    let res = await fetch("http://localhost:3000/comments");
    let comments = await res.json();
    let maxId = 0;
    for (const comment of comments) {
        const id = parseInt(comment.id) || 0;
        if (id > maxId) maxId = id;
    }
    return maxId;
}

async function SaveComment() {
    let id = document.getElementById("comment_id_txt").value;
    let text = document.getElementById("comment_text_txt").value;
    let postId = document.getElementById("comment_postId_txt").value;

    if (id) {
        let res = await fetch('http://localhost:3000/comments/' + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id, text: text, postId: postId })
        });
        if (res.ok) console.log("Cập nhật comment thành công");
    } else {
        let newId = (await getMaxCommentId() + 1).toString();
        let res = await fetch('http://localhost:3000/comments', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: newId, text: text, postId: postId })
        });
        if (res.ok) console.log("Tạo comment thành công với ID: " + newId);
    }
    ClearCommentForm();
    LoadData();
}

async function DeleteComment(id) {
    let res = await fetch("http://localhost:3000/comments/" + id, {
        method: 'DELETE'
    });
    if (res.ok) console.log("Xoá comment thành công");
    LoadData();
}

async function EditComment(id) {
    let res = await fetch('http://localhost:3000/comments/' + id);
    let comment = await res.json();
    document.getElementById("comment_id_txt").value = comment.id;
    document.getElementById("comment_text_txt").value = comment.text;
    document.getElementById("comment_postId_txt").value = comment.postId;
}

function AddCommentToPost(postId) {
    ClearCommentForm();
    document.getElementById("comment_postId_txt").value = postId;
    document.getElementById("comment_text_txt").focus();
}

function ClearCommentForm() {
    document.getElementById("comment_id_txt").value = '';
    document.getElementById("comment_text_txt").value = '';
    document.getElementById("comment_postId_txt").value = '';
}

// ==================== INIT ====================
LoadData();
