<!DOCTYPE html>
<html lang="en">

<head>
    <script src="/assets/js/tags.js"></script>
</head>

<body onload="onLoadShowTags('post');">

   <header class="mainheader">
   </header>

   <main>
      <h1 id='postsh1'>Songs</h1>

      <h3><a href="/index.html">See Tag Cloud</a></h3>
      <br><br><br><br>
      {{#posts}}
         <article class="post" data-album="{{album}}" data-author="{{author}}">
            <h2><a href="/{{path}}"> {{title}}</a></h2>
            <div class="albums">Albums:
            <span><a href="/posts.html">all</a></span>
            {{#album}}
                <span><a href="/posts.html?album={{.}}">{{.}}</a></span>
            {{/album}}
            </div>
            <div class="authors">Authors:
            <span><a href="/posts.html">all</a></span>
            {{#author}}
                <span><a href="/posts.html?author={{.}}">{{.}}</a></span>
            {{/author}}
            </div>
            {{date}}<br>
            {{{excerpt}}}
         </article>
         <br><br>
       {{/posts}}

   </main>

   <footer id="footer">
   </footer>

</body>

</html>
