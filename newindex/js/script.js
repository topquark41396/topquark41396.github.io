/**
 * Personal Start Page — script.js
 * Reads plain-text links from the body, parses them, and renders the page.
 *
 * Link format in index.html:
 *   Category Heading
 *   https://www.example.com || Link Title
 *
 * Settings are defined in settings.js (loaded before this file).
 */

document.addEventListener('DOMContentLoaded', function () {

	/* ── 1. Grab and parse the raw body text ─────────────── */
	var rawText = document.body.innerText || document.body.textContent;
	var lines   = rawText.split('\n');

	/* ── 2. Build the link sections ──────────────────────── */
	var linksDiv = document.createElement('div');
	linksDiv.id  = 'links';

	var currentBlock = null;
	var currentList  = null;

	lines.forEach(function (rawLine) {
		var line = rawLine.trim();
		if (!line) return; // skip blank lines

		if (line.startsWith('http')) {
			// It's a link — split on " || "
			var parts = line.split(' || ');
			var url   = parts[0];
			var title = parts[1] || url;

			if (!currentBlock) {
				// Links before any heading — create an unnamed block
				currentBlock = createBlock('');
				currentList  = currentBlock.querySelector('ul');
				linksDiv.appendChild(currentBlock);
			}

			var li = document.createElement('li');
			var a  = document.createElement('a');
			a.href        = url;
			a.textContent = title;
			if (typeof newWindow !== 'undefined' && newWindow) {
				a.target = '_blank';
				a.rel    = 'noopener noreferrer';
			}
			li.appendChild(a);
			currentList.appendChild(li);

		} else {
			// It's a heading — start a new block
			currentBlock = createBlock(line);
			currentList  = currentBlock.querySelector('ul');
			linksDiv.appendChild(currentBlock);
		}
	});

	/* ── 3. Build the search bar ─────────────────────────── */
	var searchEngines = [
		{ key: 'google',       label: 'Google',       action: 'https://www.google.com/search',      param: 'q'      },
		{ key: 'googleImages', label: 'Google Images', action: 'https://www.google.com/images',      param: 'q'      },
		{ key: 'yahoo',        label: 'Yahoo',         action: 'https://search.yahoo.com/search',    param: 'p'      },
		{ key: 'wikipedia',    label: 'Wikipedia',     action: 'https://www.wikipedia.org/w/index.php', param: 'search' },
		{ key: 'dictcc',       label: 'dict.cc',       action: 'https://www.dict.cc/',               param: 's'      },
		{ key: 'leo',          label: 'Leo',           action: 'https://dict.leo.org/',              param: 'search' },
		{ key: 'flickr',       label: 'Flickr',        action: 'https://www.flickr.com/search',      param: 'q'      },
		{ key: 'deviantart',   label: 'deviantART',    action: 'https://www.deviantart.com/search',  param: 'q'      }
	];

	var searchDiv = document.createElement('div');
	searchDiv.id  = 'searches';

	var hasSearchEngine = false;
	searchEngines.forEach(function (engine) {
		if (typeof window[engine.key] !== 'undefined' && window[engine.key]) {
			hasSearchEngine = true;
			var form   = document.createElement('form');
			form.method = 'get';
			form.action = engine.action;

			var input  = document.createElement('input');
			input.type = 'text';
			input.name = engine.param;
			input.maxLength = 255;

			var btn    = document.createElement('input');
			btn.type   = 'submit';
			btn.value  = engine.label;

			form.appendChild(input);
			form.appendChild(btn);
			searchDiv.appendChild(form);
		}
	});

	/* ── 4. Render everything ────────────────────────────── */
	document.body.innerHTML = '';

	if (hasSearchEngine) {
		document.body.appendChild(searchDiv);
	}
	document.body.appendChild(linksDiv);

	/* ── 5. Optionally focus the first search box ─────────── */
	if (typeof focusSearch !== 'undefined' && focusSearch && hasSearchEngine) {
		var firstInput = searchDiv.querySelector('input[type="text"]');
		if (firstInput) firstInput.focus();
	}

	/* ── Helper ──────────────────────────────────────────── */
	function createBlock(heading) {
		var block = document.createElement('div');
		block.className = 'block';

		if (heading) {
			var h1 = document.createElement('h1');
			h1.textContent = heading;
			block.appendChild(h1);
		}

		var ul = document.createElement('ul');
		block.appendChild(ul);
		return block;
	}

});
