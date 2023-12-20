<!DOCTYPE html>

<meta charset="utf-8" />
<meta name="viewport" content="width=device-width" />

<title>Pok&eacute;mon Showdown! battle simulator</title>

<link rel="stylesheet" href="/style/global.css" />

<style>
@font-face {
  font-family: 'FontAwesome';
  src: url('/theme/fonts/fontawesome-webfont.eot?v=4.0.3');
  src: url('/theme/fonts/fontawesome-webfont.eot?#iefix&v=4.0.3') format('embedded-opentype'), url('/theme/fonts/fontawesome-webfont.woff?v=4.0.3') format('woff'), url('/theme/fonts/fontawesome-webfont.ttf?v=4.0.3') format('truetype'), url('/theme/fonts/fontawesome-webfont.svg?v=4.0.3#fontawesomeregular') format('svg');
  font-weight: normal;
  font-style: normal;
}
.fa {
  display: inline-block;
  font-family: FontAwesome;
  font-style: normal;
  font-weight: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.fa-tachometer:before {content: "\f0e4";}
.fa-sort-amount-desc:before {content: "\f161";}
.fa-github:before {content: "\f09b";}
</style>
<style>
	.left {
		float: left;
		width: 560px;
	}
	.right {
		margin-left: 590px;
	}
	@media (max-width:880px) {
		.left iframe {
			width: 275px;
			height: 144px;
		}
		.left {
			width: 275px;
		}
		.right {
			margin-left: 290px;
		}
	}
	@media (max-width:600px) {
		.left {
			float: none;
			text-align: center;
			width: auto;
		}
		.right {
			margin-left: 0;
		}
	}
	.mainbutton {
		text-align: center;
	}
	.mainbutton .button {
		background: #3a884f;
		background: linear-gradient(to bottom, #4ca363, #276136);
		font-size: 16pt;
		padding: 12px 20px;
	}
	.mainbutton .button:hover {
		background: linear-gradient(to bottom, #5ac777, #2f7f44);
	}
	.mainbutton .button:active {
		background: linear-gradient(to bottom, #276136, #4ca363);
	}

</style>

<div class="body">

	<header>
		<div class="nav-wrapper"><ul class="nav">
			<!-- <li><a class="button nav-first cur" href="/"><img src="/images/pokemonshowdownbeta.png" srcset="/images/pokemonshowdownbeta.png 1x, /images/pokemonshowdownbeta@2x.png 2x" alt="Pok&eacute;mon Showdown" width="146" height="44" /> Home</a></li> -->
			<li><a class="button" href="/dex/">Pok&eacute;dex</a></li>
			<li><a class="button" href="//replay.pokemonshowdown.com/">Replays</a></li>
			<li><a class="button" href="/ladder/">Ladder</a></li>
			<li><a class="button nav-last" href="/forums/">Forum</a></li>
			<li><a class="button greenbutton nav-first nav-last" href="/play/">Play</a></li>
		</ul></div>
	</header>

</div>

<section class="section">
	<!--h1>Links</h1-->
	<style>
	.hlinklist {
		list-style: none;
		margin: 1em 0 0 0;
		padding: 0;
		font-size: 18pt;
	}
	.hlinklist li {
		width: 255px;
		float: left;
		margin: 0;
		padding: 0 3px 1em;
	}
	.hlinklist .blocklink {
		padding: 6px 0;
		margin: 0;
		text-align: center;
		font-size: 16pt;
	}
	</style>
	<ul class="hlinklist">
		<li>
			<a class="blocklink" href="/damagecalc/" target="_blank"><i class="fa fa-tachometer"></i> Damage calculator</a>
		</li>
		<li>
			<a class="blocklink" href="http://www.smogon.com/stats/" target="_blank"><i class="fa fa-sort-amount-desc"></i> Usage stats</a>
		</li>
		<li>
			<a class="blocklink" href="https://github.com/smogon/Pokemon-Showdown" target="_blank"><i class="fa fa-github"></i> GitHub repository</a>
		</li>
	</ul>
	<p style="text-align: center; clear: both">
		<a href="https://twitter.com/PokemonShowdown">@PokemonShowdown on Twitter</a>
	</p>

	<div style="clear:both;padding-top:1px"></div>
</section>

<style>
.sections-container {
	max-width: 1000px;
	margin: 0 auto;
}
.section-servers {
	float: left;
	margin: 0;
	width: 200px;
}
.section-news {
	margin-left: 260px;
}
@media (max-width:600px) {
	.section-servers {
		float: none;
		width: auto;
		margin: 20px auto;
	}
	.section-news {
		margin-left: 0;
	}
}

.linklist {
	list-style: none;
	margin: 0;
	padding: 0;
}
.linklist .blocklink {
	margin: 3px 0;
}

</style>

<div class="sections-container">

	<section class="section section-servers">
		<h1>Servers</h1>
		<ul class="linklist">
			<?php include 'lib/serverlist.inc.php'; ?>
		</ul>
	</section>

<?php
include __DIR__ . '/../config/news.inc.php';
function readableDate($time=0) {
	if (!$time) {
		$time = time();
	}
	return date('M j, Y',$time);
}

$count = 0;
foreach ($latestNewsCache as $topic_id) {
	$topic = $newsCache[$topic_id];
?>
	<section class="section section-news">
		<h1><?php echo $topic['title_html']; ?></h1>
		<?php echo @$topic['summary_html'] ?>
		<p>
			&mdash;<strong><?php echo $topic['authorname']; ?></strong> <small class="date">on <?php echo readableDate($topic['date']); ?></small> <small><a href="/news/<?= $topic['topic_id'] ?>"><?= isset($topic['details']) ? 'Read more' : 'Permalink' ?></a></small>
		</p>
	</section>
<?php
	if (++$count >= 2) break;
	if ($count === 1) {
		@insertBetweenNews();
	}
}

?>
	<section class="section section-news">
		<a href="/news/" class="button">Older news &raquo;</a>
	</section>

	<div style="clear:both;"></div>
</div>

<footer>
	<p>
		<small><a href="/rules">Rules</a> | <a href="/privacy">Privacy policy</a> | <a href="/credits">Credits</a> | <a href="/contact">Contact</a></small>
	</p>
</footer>

<?php @insertAtEnd(); ?>
