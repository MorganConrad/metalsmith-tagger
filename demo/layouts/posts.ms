<!DOCTYPE html>
<html lang="en">

<head>
    <script src="/assets/js/tags.js"></script>
</head>

<body onload="onLoadShowTags('post');">

   <header class="mainheader">
      <link rel="stylesheet" href="/assets/css/tags.css">
   </header>

   <main>
      <h1 id='postsh1'>Songs</h1>

      <h3><a href="/index.html">Go Back to Tag Cloud</a></h3>

      Click on an album or author to see a subset of Beatles songs.<br>
      If you want to do an "AND", type the query in the URL, e.g.  ?album=Abbey Road&author=Harrison
      <br><br>

      {{#posts}}
         <article class="post" data-album="{{album}}" data-author="{{author}}">

            <div class="tags albums">Albums:
            <span><a href="/posts.html">all</a></span>
            {{#album}}
                <span><a href="/posts.html?album={{.}}">{{.}}</a></span>
            {{/album}}
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div class="tags authors">Authors:
            <span><a href="/posts.html">all</a></span>
            {{#author}}
                <span><a href="/posts.html?author={{.}}">{{.}}</a></span>
            {{/author}}
            {{date}}
            </div>
            <h3><a href="/{{path}}"> {{title}}</a></h3>
            {{{excerpt}}}
         </article>
         <br>
       {{/posts}}

   </main>

   <footer id="footer">
   </footer>

</body>

</html>
