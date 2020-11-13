//+-----------------------------------------------------------------------------+
//|	Array 																		|
//+-----------------------------------------------------------------------------+
arrays_match = function (aa, bb, cond, func) {
    if (typeof aa !== 'object') return;
    if (typeof bb !== 'object') return;
    if (typeof cond !== 'function') return;
    if (typeof func !== 'function') return;
    aa.forEach(a => {
        bb.forEach(b => {
            if (cond.apply(this, [a,b])) {
                func.apply(this, [a,b]);
            }
        })
    })
}



Array.prototype.show_me = function(note) {
    console.log(note, this );
    return this;
}



Array.prototype.found = function(a, debug = false) {
    if (debug) console.log("Array.found");
    if (typeof a !== 'object') {
        return this.indexOf(a) >= 0;
    }
    
    for (var i=0; i<this.length; i++) {
        if (debug) console.log("item", this[i]);
        
        var is_matched = true;
        for (var field in a) {
            is_matched &= this[i][field] !== undefined;
            is_matched &= this[i][field] == a[field];
            if (debug) console.log("field", field, "=>", is_matched, "<=", this[i][field], "vs", a[field]);
            if (!is_matched) break;
        }
        
        if (is_matched) return true;
    }
    
    /*
    var aa = [
        {a: 1, b: 2},
        {a: 1, b: 3},
        {a: 2, c: 3},
    ];
    var a = {a: 1, b: 2};

    console.log(aa, a);
    console.log("is found", aa.found(a));

    */
    
    return false;
}
Array.prototype.map_by = function(field) {
    return this.map(item => item[field]);
}
Array.prototype.sum = function() {
    var sum = 0;
    for (var i = 0; i < this.length; i++) {
        sum += this[i];
    }
    return sum;
}
Array.prototype.SumByKey = function(k) {
    // var a = [
    // 	{'about':2, 'b':'bbb'},
    // 	{'as':5, 'b':'bbb'},
    // ];
    // var sum = a.SumByKey('b');
    //-----------------------------------------------------------
    var sum = 0;
    var found = false;
    for (var i = 0; i < this.length; i++) {
        if (typeof this[i] != 'object') continue;
        found = true;
        sum += this[i][k];
    }
    //-----------------------------------------------------------
    return (found) ? sum : null;
}
// Array.prototype.length = function() {
//     // return this.length;
// }
Array.prototype.last = function(offset = 0) {
    return this[this.length + offset - 1];
}
Array.prototype.shuffle = function() {
    var j, x, i;

    var aa = [];
    for (var i = 0; i < this.length; i++) {
        aa.push(this[i]);
    }

    for (i = aa.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = aa[i];
        aa[i] = aa[j];
        aa[j] = x;
    }
    return aa;
}
Array.prototype.left = function(n) {

    var aa = [];
    for (var i = 0; i < this.length; i++) {
        aa.push(this[i]);
    }

    return aa.splice(0, n);
}
Array.prototype.right = function(n) {

    var aa = [];
    for (var i = 0; i < this.length; i++) {
        aa.push(this[i]);
    }

    return aa.splice(aa.length - n, n);
}
Array.prototype.rand = function() {
    var j = Math.floor(Math.random() * (this.length));
    return this[j];
}
Array.prototype.has = function(s) {
    if (typeof s != 'object') s = [s.toString()];

    for (var i = 0; i < s.length; i++) {
        if (this.indexOf(s[i]) >= 0) return true;
    }

    return false;
}
Array.prototype.exclude = function(exclude_array) {
    var new_array = this.filter(function(v) {
        return !exclude_array.has(v);
    });
    return new_array;
}
Array.prototype.field = function(field) {
    var new_array = [];
    this.forEach(function(row) {
        if (row[field] === undefined) return;
        new_array.push(row[field]);
    });

    return new_array;
}
Array.prototype.$each = function(ee, f) {
    if (typeof ee == 'string') ee = $(ee);

	if (ee.length < 1) return null;

	var self = this;

	ee.each(function() {
		var ret = f.apply(self, [$(this)]);

		if (ret != null) self.push( ret );
	});
}
Array.prototype.each = function(f) {
	var self = this;

    for (var i=0; i<this.length; i++) {
        f.apply(this, [this[i]]);
    }

    return this;
}
Array.prototype.toArrayBy = function(field) {
    var new_ = [];
    this.forEach(function(row) {
        if (row[field] === undefined) return;
        new_.push(row[field]);
    });
    return new_;
}
Array.prototype.toObjectBy = function(field) {
    var new_ = {};
    this.forEach(function(row) {
        if (row[field] === undefined) return;

        if (new_[row[field]] === undefined)
            new_[row[field]] = {
                list: [],
                length: 0,
            };

        var r = new_[row[field]];

        r = $.extend(r, row);
        r[r.length] = row;
        r.length++;

        new_[row[field]].list.push(row);

        new_[row[field]].find = function(params) {
            var found_items = [];

            this.list.forEach(function(item) {
                var is_match = true;
                for (var key in params) {
                    if (!is_match) break;
                    is_match &= item[key] == params[key];
                }

                if (is_match) found_items.push(item);
            })

            return found_items;
        }
    });

    return new_;
}
Array.prototype.mergeBy = function(field, with_array) {
    var byField = with_array.toObjectBy(field);
    try {
        this.forEach(function(row) {
            if (byField[row[field]] == undefined) return;
            if (byField[row[field]][0] == undefined) return;
            var matched_row = byField[row[field]][0];
            row = $.extend(row, matched_row);
        });

    } catch (e) {}
    return this;
}
Array.prototype.sort_asc_by = function(field) {
    if (this.length < 1) return this;
    if (this[0][field] === undefined) return this;

    return this.sort(function(a, b) {
        return parseFloat(a[field]) - parseFloat(b[field]);
    });;
}
Array.prototype.sort_desc_by = function(field) {
    if (this.length < 1) return this;
    if (this[0][field] === undefined) return this;

    return this.sort(function(a, b) {
        return parseFloat(b[field]) - parseFloat(a[field]);
    });;
}
Array.prototype.splice2 = function(index, n = 1) {
    var a = [];
    for (var i = 0; i < this.length; i++) {
        if (i >= index && i <= index + n - 1) continue;
        a.push(this[i]);
    }
    return a;
}
Array.prototype.jn = function() {
    return this.join("\n");
}
Array.prototype.merge = function(a) {
    if (typeof a !== 'object') return this;
    if (a.length < 1) return this;
    for (var i=0; i<a.length; i++) {
        this.push( a[i] );
    }
    return this;
}
Array.prototype.uniqueBy = function(fields) {
    var new_ = [];
    var indexer = [];

    if (typeof fields === 'string'  &&  fields.indexOf(',') > 0) fields = fields.split(",").map(field => field.trim());
    if (typeof fields !== 'object') fields = [fields];

    this.forEach(function(row) {
        var unique_values = fields.map(field => row[field]).join(",");
        if (indexer.indexOf(unique_values) >= 0) return;
        indexer.push(unique_values);
        new_.push(row);
    });
    return new_;
}
Array.prototype.unique_by = function(field) {
    var new_array = [];
    this.forEach(item => {
        if ( new_array.map(i => i[field]).indexOf(item[field]) < 0 )
            new_array.push( item );
    })
    return new_array;
}
Array.prototype.unique = function() {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}

//+-----------------------------------------------------------------------------+
//| String - v2.0                                                               |
//+-----------------------------------------------------------------------------+
String.prototype.extract_emails = function() {
    var emails = []
    var html = this.toString();
    
    html = html.replace(/\[a\]/g, '@');
	html = html.replace(/[\-\[|\{|\(]@[\]|\}\-\)]/ig, "@")
	html = html.replace(/[\-\[|\{|\(]at[\]|\}\-|\)]/ig, "@")
	html = html.replace(/\s.\s/ig, ".")
	html = html.replace(/ @ /ig, "@")

	emails = emails.concat( html.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi) );

	if (emails == null  ||  emails.length < 1) return;

    //--- format
	emails = emails
        .filter(email => email!=null && email.length < 40 && email.length > 5)
        .map(email => email.trim().toLowerCase())
        .map(email => email.has(":") ? email.split(":")[1] : email)
	    .unique()

    //--- format 2
	emails = emails.map(email => {
        email = email[0].in(".|,|?".split("|")) ? email.substr(1, email.length-1) : email;
        email = email[ email.length-1 ].in(".|,|?".split("|")) ? email.substr(0, email.length-1) : email;
		return email
	});
    
    return emails;
}

String.prototype.slash_end = function() {
    var s = this.toString();
    if (s[s.length-1] == '/') return s;
    else return s + "/";
}
String.prototype.get_domain = function() {
    var domain = this;

    if (domain.indexOf('//') >= 0) domain = domain.split("//")[1];
    if (domain.indexOf('/') > 0) domain = domain.split('/')[0];

    domain = domain.replace("www.", "");
    domain = domain.replace("www2.", "");

    return domain;
}
String.prototype.root_path = function() {
    var domain = this.toString();
    var protocol = domain.split("://")[0];

    if (domain.indexOf('//') >= 0) domain = domain.split("//")[1];
    if (domain.indexOf('/') > 0) domain = domain.split('/')[0];

    return protocol + "://" + domain;
}
String.prototype.full_url = function(root) {
    var s = this.toString();
    
    if (s.indexOf('http://') === 0 || s.indexOf('https://') === 0)    return s;
    
    s = root.root_path().rtrim("/") + "/" + s.ltrim("/");
    
    return s;
}
String.prototype.ltrim = function(c) {
    c == c || "";
    //--- Trim http://domain.com/ -> http://domain.com 
    var s = this.toString();
    while (s[0] == c) {
        s = s.substr(1, s.length-1);
    }
    return s;
}
String.prototype.rtrim = function(c) {
    c == c || "";
    //--- Trim http://domain.com/ -> http://domain.com 
    var s = this.toString();
    while (s[s.length-1] == c) {
        s = s.substr(0, s.length-1);
    }
    return s;
}
String.prototype.xtrim = function(c) {
    c == c || "";
    //--- Trim http://domain.com/ -> http://domain.com 
    var s = this.toString();
    while (s[s.length-1] == c) {
        s = s.substr(0, s.length-1);
    }
    while (s[0] == c) {
        s = s.substr(1, s.length-1);
    }
    return s;
}
String.prototype.toTypeOf = function(v) {
	var s = this.toString();
	switch (typeof v) {
		case 'number':
		case 'boolean':
			return JSON.parse(s);
		default: return s;
	}
}
String.prototype.safe = function(_default = null, params) {
    try {
        var s = this.toString();

        for (var field in params) {
            eval("var " + field + " = params[field];");
        }
        eval("var ret = " + s);

        if (ret === undefined) ret = _default;

        return ret;
    } catch (e) {
        return _default;
    }
}
String.prototype.format_1 = function() {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
String.prototype.sub_between = function(s1, s2) {
    var s = this.toString();
    if (s.indexOf(s1) < 0) return null;
    s = s.split(s1)[1];
    if (s.indexOf(s2) < 0) return null;
    s = s.split(s2)[0];
    return s;
}
String.prototype.saveFileAs = function(folder, filename) {
    var xid = "_earns_save_" + rand(1000, 9999);
    $("[id*=_earns_save_]").remove();

    var ext_this = this.toString().fileExtention().toLowerCase();
    var ext_filename = filename.fileExtention().toLowerCase();

    if (ext_this !== ext_filename) filename += "." + ext_this;

    $("body").append($("<a id=" + xid + " style='display:block'>").attr('href', this.toString()).text(filename));

    _("Saving FileAs [" + filename + "]...", "lightgray");
    $("#" + xid).SaveTo(folder, filename, 5, 1, 1);
    return folder + "/" + filename;
}
String.prototype.appendTo = function(s) {
    s += this.toString();
    return s;
}
String.prototype.replace2 = function(input) {
    return this.replace_variables(input);
}
String.prototype.ucFirst = function() {
    var new_str = this.toString();
    new_str = new_str.charAt(0).toUpperCase() + new_str.substr(1);
    return new_str;
}
String.prototype.forEach = function(f) {
    if (typeof f !== 'function') return this;
    var s = this.toString();
    for (var i = 0; i < s.length; i++) {
        f(s[i], i);
    }
}
String.prototype.has = function(s) {
    if (typeof s != 'object') s = [s];
    for (var i = 0; i < s.length; i++) {
        if (this.toString().indexOf(s[i]) >= 0) return true;
    }
    return false;
}
String.prototype.replace_variables = function(input) {
    if (input['wrapper'] === undefined) input['wrapper'] = "{}";
    //-----------------------------------------------------------
    var new_str = this;
    //-----------------------------------------------------------
    for (var v in input) {
        switch (input['wrapper']) {
            case "{}":
                {
                    new_str = eval(' new_str.replace(/{' + v + '}/ig, input[v]) ');
                    break;
                }
            case "[]":
                {
                    // new_str = new_str.replace("["+v+"]", input[v]);
                    new_str = eval(' new_str.replace(/\\[' + v + '\\]/ig, input[v]) ');
                    break;
                }
            case "::":
                {
                    // new_str = new_str.replace(":"+v+":", input[v]);
                    new_str = eval(' new_str.replace(/:' + v + ':/ig, input[v]) ');
                    break;
                }
        }
    }

    //-----------------------------------------------------------
    return new_str;
}
String.prototype.remove = function(search) {
    //-----------------------------------------------------------
    var new_str = this;
    //-----------------------------------------------------------
    // _( search );
    // _( typeof search );
    //-----------------------------------------------------------
    if (typeof search != 'object') search = [search];
    //-----------------------------------------------------------
    new_str = this;
    //-----------------------------------------------------------
    for (var i = 0; i < search.length; i++) new_str = new_str.replace(search[i], '');
    //-----------------------------------------------------------
    return new_str;
}
String.prototype.between = function(from, to) {
    //-----------------------------------------------------------
    if (!this.has(from)) return this;
    //-----------------------------------------------------------
    var new_str = this.split(from)[1];
    //-----------------------------------------------------------
    if (!new_str.has(to)) return this;
    //-----------------------------------------------------------
    new_str = new_str.split(to)[0];
    //-----------------------------------------------------------
    return new_str;
}
String.prototype.keep = function(keep) {
    if (keep == undefined) return this;
    //-----------------------------------------------------------
    var new_str = '';
    for (var i = 0; i < this.length; i++) {
        if (keep.indexOf(this[i]) >= 0) new_str += this[i];
    }
    //-----------------------------------------------------------
    return new_str;
}
String.prototype.extractEmails = function() {

    return this.toString().match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}
String.prototype.fileExtention = function() {
    var ext = this.toString().split('.').pop();
    ext = ext.split('.')[0];
    return ext;
}
String.prototype.parseExtension = function() {
    if (this.has('.gif')) return ".gif";
    if (this.has('.png')) return ".png";
    if (this.has('.jpg')) return ".jpg";
    if (this.has('.mp4')) return ".mp4";
    if (this.has('.pdf')) return ".pdf";
    return null;
}
String.prototype.in = function(arr) {
    if (typeof arr === 'string' && arr.indexOf(',') > 0) return arr.split(",").map(a => a.trim()).indexOf(this.toString()) >= 0;
    return arr.indexOf(this.toString()) >= 0;
}
String.prototype.not_in = function(arr) {
    if (typeof arr === 'string' && arr.indexOf(',') > 0) return arr.split(",").map(a => a.trim()).indexOf(this.toString()) < 0;
    return arr.indexOf(this.toString()) < 0;
    
    // return !this.toString().in(arr);
}
String.prototype.switch = function(obj) {
    for (var field in obj) {
        if (field == this.toString()) return obj[field];
    };
    return null;
}
String.prototype.switchLike = function(obj) {
    for (var field in obj) {
        if (this.toString().indexOf(field) >= 0) return obj[field];
    };
    return null;
}
String.prototype.sprintf = function(value) {
    if (typeof value !== 'object') value = [value];

    var s = this.toString();
    value.forEach(function(v) {
        if (s.indexOf('{%}') >= 0) s = s.replace(/\{\%\}/, v);
        else if (s.indexOf('%') >= 0) s = s.replace(/\%/, v);
        else if (s.indexOf('?') >= 0) s = s.replace(/\?/, v);
    });

    return s;
}
String.prototype.rpl = function(value) {
    return this.sprintf(value);
}
String.prototype.pr = function(value, format) {
    if (typeof value !== 'object') value = [value];

    var s = this.toString();
    value.forEach(function(v) {
        if (format !== undefined) v = v._(format);
        if (s.indexOf('?') >= 0) s = s.replace(/\?/, v);
    });

    return s;
}
String.prototype.addslashes = function() {
    return this.toString().replace(/\\/g, '\\\\').
    replace(/\u0008/g, '\\b').
    replace(/\t/g, '\\t').
    replace(/\n/g, '\\n').
    replace(/\f/g, '\\f').
    replace(/\r/g, '\\r').
    replace(/'/g, '\\\'').
    replace(/"/g, '\\"');
}
String.prototype.stripslashes = function() {
    return this.replace(/\\(.)/mg, "$1");
}
String.prototype.spin = function() {
    var string_preg_quote = function(str, delimiter) {
        return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
    }

    var text = this.toString();
    if (text == null) return null;
    var matches = text.match(/{[^<]+/gi);
    if (matches === null) {
        return text;
    }
    if (matches[0].indexOf('{') != -1) {
        matches[0] = matches[0].substr(matches[0].indexOf('{') + 1);
    }
    if (matches[0].indexOf('}') != -1) {
        matches[0] = matches[0].substr(0, matches[0].indexOf('}'));
    }
    var parts = matches[0].split('|');
    var t = string_preg_quote(matches[0]);
    e_v = new RegExp('{' + t + '}', 'g');
    text = text.replace(e_v, parts[Math.floor(Math.random() * parts.length)]);
    return text.spin();
}
String.prototype.to_json = function() {
    try {
        var o = this.toString();
        // o = o.replace(/\n/ig, '\\n');
        eval("o = " + o + ";");
        return o;
    } catch (e) {
        return this.toString();
    }
}
String.prototype.to_slug = function() {
    str = this.toString();
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap Ã± for n, etc
    var from = "Ã Ã¡Ã¤Ã¢Ã¨Ã©Ã«ÃªÃ¬Ã­Ã¯Ã®á»‹Ã²Ã³á»á»ÃµÃ¶Ã´Ã¹ÃºÃ¼Ã»Ã±Ã§Â·/_,:;";
    var to   = "aaaaeeeeiiiiiooooooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str
        .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
        .replace(/\s+/g, "-") // collapse whitespace and replace by -
        .replace(/-+/g, "-") // collapse dashes
        .replace(/^-+/, "") // trim - from start of text
        .replace(/-+$/, ""); // trim - from end of text

    return str;
    
    var slug = this.toString().toLowerCase().trim();
    slug = slug.replace(/\t/g, '-');
    slug = slug.replace(/\n/g, '-');
    slug = slug.replace(/\r/g, '-');
    slug = slug.replace(/\s/g, '-');
    slug = slug.replace(/_/g, '-');
    slug = slug.replace(/--/g, '-');
    return slug;
}

//+-----------------------------------------------------------------------------+
//|	Date.prototype																|
//+-----------------------------------------------------------------------------+
Date.prototype.toSQL = function() {

    return this.ToSQL();
}
Date.prototype.ToSQL = function() {
    // var s = "";
    // s += this.getFullYear() + "-" + (this.getMonth()+1) + "-" + this.getDate();
    // s += " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
    return this.toISOString().split("T")[0];
}
Date.prototype.toFullSQL = function() {
    // var s = "";
    // s += this.getFullYear() + "-" + (this.getMonth()+1) + "-" + this.getDate();
    // s += " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
    var dd = this.toISOString().split("T")[0];
    var tt = this.toISOString().split("T")[1].split(".")[0];
    return [dd, tt].join(" ");
}
Date.prototype.toUTCSQL = function() {
    var dd = [this.getUTCFullYear(), this.getUTCMonth()+1, this.getUTCDate()];
    var tt = [this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];
    
    dd = dd.map(n => { return (n<10) ? "0" + n : n });
    tt = tt.map(n => { return (n<10) ? "0" + n : n });
    
    return [dd.join("-"), tt.join(":")].join(" ");
}
Date.prototype.toUTCTimeStamp = function() {
    //console.log("UTCTimeStamp", this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds());
    return Date.UTC(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds())/1000;
}
Date.prototype.SecondsAgo = function(custom_now = null) {
    //var seconds = this.getSeconds();

    var xnow = (custom_now == null) ? new Date() : new Date(custom_now);
    var seconds = Math.abs(this.getTime() / 1000 - xnow.getTime() / 1000);
    return seconds;

    var templates = {
        prefix: "",
        suffix: "",
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years"
    };
    var template = function(t, n) {
        return templates[t] && templates[t].replace(/%d/i, Math.abs(Math.round(n)));
    };

    var minutes = seconds / 60;
    var hours = minutes / 60;
    var days = hours / 24;
    var years = days / 365;

    var str = templates.prefix + (
        seconds < 45 && template('seconds', seconds) ||
        seconds < 90 && template('minute', 1) ||
        minutes < 45 && template('minutes', minutes) ||
        minutes < 90 && template('hour', 1) ||
        hours < 24 && template('hours', hours) ||
        hours < 42 && template('day', 1) ||
        days < 30 && template('days', days) ||
        days < 45 && template('month', 1) ||
        days < 365 && template('months', days / 30) ||
        years < 1.5 && template('year', 1) ||
        template('years', years)
    ) + templates.suffix;

    return str;
}
Date.prototype.timeAgo = function(custom_now = null) {
    //var seconds = this.getSeconds();

    var xnow = (custom_now == null) ? new Date() : new Date(custom_now);
    var seconds = Math.abs(this.getTime() / 1000 - xnow.getTime() / 1000);

    var templates = {
        prefix: "",
        suffix: "",
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years"
    };
    var template = function(t, n) {
        return templates[t] && templates[t].replace(/%d/i, Math.abs(Math.round(n)));
    };

    var minutes = seconds / 60;
    var hours = minutes / 60;
    var days = hours / 24;
    var years = days / 365;

    var str = templates.prefix + (
        seconds < 45 && template('seconds', seconds) ||
        seconds < 90 && template('minute', 1) ||
        minutes < 45 && template('minutes', minutes) ||
        minutes < 90 && template('hour', 1) ||
        hours < 24 && template('hours', hours) ||
        hours < 42 && template('day', 1) ||
        days < 30 && template('days', days) ||
        days < 45 && template('month', 1) ||
        days < 365 && template('months', days / 30) ||
        years < 1.5 && template('year', 1) ||
        template('years', years)
    ) + templates.suffix;

    return str;
}
Date.prototype.timeToGo = function(custom_now = null) {
    //var seconds = this.getSeconds();

    var xnow = (custom_now == null) ? new Date() : new Date(custom_now);
    var seconds = Math.abs(this.getTime() / 1000 - xnow.getTime() / 1000);

    var templates = {
        prefix: "",
        suffix: "",
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years"
    };
    var template = function(t, n) {
        return templates[t] && templates[t].replace(/%d/i, Math.abs(Math.round(n)));
    };

    var minutes = seconds / 60;
    var hours = minutes / 60;
    var days = hours / 24;
    var years = days / 365;

    var str = templates.prefix + (
        seconds < 45 && template('seconds', seconds) ||
        seconds < 90 && template('minute', 1) ||
        minutes < 45 && template('minutes', minutes) ||
        minutes < 90 && template('hour', 1) ||
        hours < 24 && template('hours', hours) ||
        hours < 42 && template('day', 1) ||
        days < 30 && template('days', days) ||
        days < 45 && template('month', 1) ||
        days < 365 && template('months', days / 30) ||
        years < 1.5 && template('year', 1) ||
        template('years', years)
    ) + templates.suffix;

    return str;
}
Date.prototype.addDays = function(d) {
    this.setTime(this.getTime() + (d * 24 * 60 * 60 * 1000));
    return this;
}
Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}
Date.prototype.addMinutes = function(m) {
    this.setTime(this.getTime() + (m * 60 * 1000));
    return this;
}
Date.prototype.addSeconds = function(s) {
    this.setTime(this.getTime() + (s * 1000));
    return this;
}
Date.prototype.___ = function(title) {
    _Var(title, this);
    return this;
}
FALSE = function(f) {
    if (typeof f === 'function') f.apply(this);
    return false;
}

rand_string = function(l = 5, possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") {
    var text = "";
    for (var i = 0; i < l; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

$found = function(selector) { return $(selector).length > 0; }

MD5 = function(s, length = 0) {
    if (typeof s == 'object') s = JSON.stringify(s);
    if (length == 0) return MD5_(s);
    else return MD5_(s).substr(0, length);
}
MD5_ = function(s) {

    function L(k, d) {
      return (k << d) | (k >>> (32 - d))
    };

    function K(G, k) {
      var I, d, F, H, x;
      F = (G & 2147483648);
      H = (k & 2147483648);
      I = (G & 1073741824);
      d = (k & 1073741824);
      x = (G & 1073741823) + (k & 1073741823);
      if (I & d) {
        return (x ^ 2147483648 ^ F ^ H)
      }
      if (I | d) {
        if (x & 1073741824) {
            return (x ^ 3221225472 ^ F ^ H)
        } else {
            return (x ^ 1073741824 ^ F ^ H)
        }
      } else {
        return (x ^ F ^ H)
      }
    };

    function r(d, F, k) {
      return (d & F) | ((~d) & k)
    }

    function q(d, F, k) {
      return (d & k) | (F & (~k))
    }

    function p(d, F, k) {
      return (d ^ F ^ k)
    }

    function n(d, F, k) {
      return (F ^ (d | (~k)))
    }

    function u(G, F, aa, Z, k, H, I) {
      G = K(G, K(K(r(F, aa, Z), k), I));
      return K(L(G, H), F)
    }

    function f(G, F, aa, Z, k, H, I) {
      G = K(G, K(K(q(F, aa, Z), k), I));
      return K(L(G, H), F)
    }

    function D(G, F, aa, Z, k, H, I) {
      G = K(G, K(K(p(F, aa, Z), k), I));
      return K(L(G, H), F)
    }

    function t(G, F, aa, Z, k, H, I) {
      G = K(G, K(K(n(F, aa, Z), k), I));
      return K(L(G, H), F)
    }

    function e(G) {
      var Z;
      var F = G.length;
      var x = F + 8;
      var k = (x - (x % 64)) / 64;
      var I = (k + 1) * 16;
      var aa = Array(I - 1);
      var d = 0;
      var H = 0;
      while (H < F) {
        Z = (H - (H % 4)) / 4;
        d = (H % 4) * 8;
        aa[Z] = (aa[Z] | (G.charCodeAt(H) << d));
        H++
      }
      Z = (H - (H % 4)) / 4;
      d = (H % 4) * 8;
      aa[Z] = aa[Z] | (128 << d);
      aa[I - 2] = F << 3;
      aa[I - 1] = F >>> 29;
      return aa
    }

    function B(x) {
      var k = "",
        F = "",
        G, d;
      for (d = 0; d <= 3; d++) {
        G = (x >>> (d * 8)) & 255;
        F = "0" + G.toString(16);
        k = k + F.substr(F.length - 2, 2)
      }
      return k
    }

    function J(k) {
      k = k.replace(/rn/g, "n");
      var d = "";
      for (var F = 0; F < k.length; F++) {
        var x = k.charCodeAt(F);
        if (x < 128) {
            d += String.fromCharCode(x)
        } else {
            if ((x > 127) && (x < 2048)) {
              d += String.fromCharCode((x >> 6) | 192);
              d += String.fromCharCode((x & 63) | 128)
            } else {
              d += String.fromCharCode((x >> 12) | 224);
              d += String.fromCharCode(((x >> 6) & 63) | 128);
              d += String.fromCharCode((x & 63) | 128)
            }
        }
      }
      return d
    }
    var C = Array();
    var P, h, E, v, g, Y, X, W, V;
    var S = 7,
      Q = 12,
      N = 17,
      M = 22;
    var A = 5,
      z = 9,
      y = 14,
      w = 20;
    var o = 4,
      m = 11,
      l = 16,
      j = 23;
    var U = 6,
      T = 10,
      R = 15,
      O = 21;
    s = J(s);
    C = e(s);
    Y = 1732584193;
    X = 4023233417;
    W = 2562383102;
    V = 271733878;
    for (P = 0; P < C.length; P += 16) {
      h = Y;
      E = X;
      v = W;
      g = V;
      Y = u(Y, X, W, V, C[P + 0], S, 3614090360);
      V = u(V, Y, X, W, C[P + 1], Q, 3905402710);
      W = u(W, V, Y, X, C[P + 2], N, 606105819);
      X = u(X, W, V, Y, C[P + 3], M, 3250441966);
      Y = u(Y, X, W, V, C[P + 4], S, 4118548399);
      V = u(V, Y, X, W, C[P + 5], Q, 1200080426);
      W = u(W, V, Y, X, C[P + 6], N, 2821735955);
      X = u(X, W, V, Y, C[P + 7], M, 4249261313);
      Y = u(Y, X, W, V, C[P + 8], S, 1770035416);
      V = u(V, Y, X, W, C[P + 9], Q, 2336552879);
      W = u(W, V, Y, X, C[P + 10], N, 4294925233);
      X = u(X, W, V, Y, C[P + 11], M, 2304563134);
      Y = u(Y, X, W, V, C[P + 12], S, 1804603682);
      V = u(V, Y, X, W, C[P + 13], Q, 4254626195);
      W = u(W, V, Y, X, C[P + 14], N, 2792965006);
      X = u(X, W, V, Y, C[P + 15], M, 1236535329);
      Y = f(Y, X, W, V, C[P + 1], A, 4129170786);
      V = f(V, Y, X, W, C[P + 6], z, 3225465664);
      W = f(W, V, Y, X, C[P + 11], y, 643717713);
      X = f(X, W, V, Y, C[P + 0], w, 3921069994);
      Y = f(Y, X, W, V, C[P + 5], A, 3593408605);
      V = f(V, Y, X, W, C[P + 10], z, 38016083);
      W = f(W, V, Y, X, C[P + 15], y, 3634488961);
      X = f(X, W, V, Y, C[P + 4], w, 3889429448);
      Y = f(Y, X, W, V, C[P + 9], A, 568446438);
      V = f(V, Y, X, W, C[P + 14], z, 3275163606);
      W = f(W, V, Y, X, C[P + 3], y, 4107603335);
      X = f(X, W, V, Y, C[P + 8], w, 1163531501);
      Y = f(Y, X, W, V, C[P + 13], A, 2850285829);
      V = f(V, Y, X, W, C[P + 2], z, 4243563512);
      W = f(W, V, Y, X, C[P + 7], y, 1735328473);
      X = f(X, W, V, Y, C[P + 12], w, 2368359562);
      Y = D(Y, X, W, V, C[P + 5], o, 4294588738);
      V = D(V, Y, X, W, C[P + 8], m, 2272392833);
      W = D(W, V, Y, X, C[P + 11], l, 1839030562);
      X = D(X, W, V, Y, C[P + 14], j, 4259657740);
      Y = D(Y, X, W, V, C[P + 1], o, 2763975236);
      V = D(V, Y, X, W, C[P + 4], m, 1272893353);
      W = D(W, V, Y, X, C[P + 7], l, 4139469664);
      X = D(X, W, V, Y, C[P + 10], j, 3200236656);
      Y = D(Y, X, W, V, C[P + 13], o, 681279174);
      V = D(V, Y, X, W, C[P + 0], m, 3936430074);
      W = D(W, V, Y, X, C[P + 3], l, 3572445317);
      X = D(X, W, V, Y, C[P + 6], j, 76029189);
      Y = D(Y, X, W, V, C[P + 9], o, 3654602809);
      V = D(V, Y, X, W, C[P + 12], m, 3873151461);
      W = D(W, V, Y, X, C[P + 15], l, 530742520);
      X = D(X, W, V, Y, C[P + 2], j, 3299628645);
      Y = t(Y, X, W, V, C[P + 0], U, 4096336452);
      V = t(V, Y, X, W, C[P + 7], T, 1126891415);
      W = t(W, V, Y, X, C[P + 14], R, 2878612391);
      X = t(X, W, V, Y, C[P + 5], O, 4237533241);
      Y = t(Y, X, W, V, C[P + 12], U, 1700485571);
      V = t(V, Y, X, W, C[P + 3], T, 2399980690);
      W = t(W, V, Y, X, C[P + 10], R, 4293915773);
      X = t(X, W, V, Y, C[P + 1], O, 2240044497);
      Y = t(Y, X, W, V, C[P + 8], U, 1873313359);
      V = t(V, Y, X, W, C[P + 15], T, 4264355552);
      W = t(W, V, Y, X, C[P + 6], R, 2734768916);
      X = t(X, W, V, Y, C[P + 13], O, 1309151649);
      Y = t(Y, X, W, V, C[P + 4], U, 4149444226);
      V = t(V, Y, X, W, C[P + 11], T, 3174756917);
      W = t(W, V, Y, X, C[P + 2], R, 718787259);
      X = t(X, W, V, Y, C[P + 9], O, 3951481745);
      Y = K(Y, h);
      X = K(X, E);
      W = K(W, v);
      V = K(V, g)
    }
    var i = B(Y) + B(X) + B(W) + B(V);
    return i.toLowerCase()
}
//+-----------------------------------------------------------------------------+
//| DB3                                                                         |
//+-----------------------------------------------------------------------------+
DB3 = function(input) {
    //-----------------------------------------------------------
    this.is_debug = 1;
    this.sqls = [];
    this.ret = {
        rows: [],
        rowsBy: {},
    };
    this.table = {};
    //-----------------------------------------------------------
    this.url = (input != undefined && input['url'] != undefined) ? input['url'] : null;
    //-----------------------------------------------------------
    this.setting = $.extend({
        dbname: null,
        user: null,
        pass: null,
        server: 'localhost'
    }, input);
    //-----------------------------------------------------------
}
DB3.prototype.reset_queue = function() {
    this.sqls = [];
    return this;
}
DB3.prototype.queue = function(new_sql) {
    if (new_sql == null || new_sql == undefined) return this;
    this.sqls.push(new_sql);
    return this;
}
DB3.prototype.query_queue = function() {
    if (this.sqls.length < 1) return;
    this.Query(this.sqls.join(";"));
    console.log(`self.DB3.query_queue processed (${this.sqls.length} queries) !`, "lightblue");
    return this;
}
DB3.prototype.Query = function(input) {
    return;
    
    var self = this;
    //-----------------------------------------------------------
    if (input == null) return this;
    //-----------------------------------------------------------
    this.sql = null;
    if (typeof input === 'string') this.sql = input;
    if (is_array(input) && input.length > 0) this.sql = input.join(";");
    if (isset(input.sql)) this.sql = (input['sql'] != undefined) ? input['sql'] : null;
    if (this.sql == null) return null;
    this.last_sql = this.sql;
    //-----------------------------------------------------------
    var ret = this._jSQL(this.sql);
    this.ret = ret;
    //-----------------------------------------------------------
    // console.log(ret);
    //-----------------------------------------------------------
    if (isset(input.id) && ret.found) { // SELECT 

        this.ret.fields = Object.keys(ret.rows[0]);

        //--- append other functions if exists in `input`
        for (var f in input) {
            if (typeof input[f] !== 'function') continue;
            if (f.in("UpdateSQL,Update")) continue;
            ret.rows.forEach(function(row) {
                row[f] = input[f];
            });
        }


        //--- Append .UpdateSQL & .Update function
        ret.rows.forEach(function(row) {
            row._db = {
                'table': input.table,
                'id': input.id,
            };

            row.UpdateSQL = function(set) {
                return "UPDATE `" + input.table + "` SET " + self.SqlSet(set) + " WHERE `" + input.id + "`='" + this[input.id] + "' LIMIT 1 ";
            }
            row.Update = function(set) {
                console.log(this.UpdateSQL(set), "lightgray");
                if (self.Query(this.UpdateSQL(set)).ret.success) {
                    $.extend(this, set);
                    console.log("--- row.Update (#" + this[input.id] + ") : " + JSON.stringify(set) + " ", "lightgrey");
                } else {
                    console.log("--- ERR: Row.Update", "red");
                    console.log(self.ret);
                }
                return this;
            }
        });


        //--- rowsBy
        // this._rowsBy(this.ret.fields, ret.rows);


        //--- Save to this.rows
        this.rows = ret.rows;
    } //--- SELECT 
    //-----------------------------------------------------------
    return this;
}
DB3.prototype.firstRow = function() {

    return (this.ret.found) ? this.ret.rows[0] : null;
}
DB3.prototype.showReturn = function(s = 1) {
    if (s == 0) return this;
    console.log(this.sql, 'lightgray');
    console.log(this.ret);
    return this;
}
DB3.prototype.jsonFields = function(fields) {
    if (this.rows === undefined || this.rows.length < 1) return this;
    if (fields === null) return this;

    var rows = this.rows;
    var tFields = [fields];
    if (typeof fields === 'string' && fields.indexOf(',') > 0) tFields = fields.split(",");
    if (typeof fields === 'object' && fields.length > 0) tFields = fields;

    tFields.forEach(function(field) {
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row[field] === undefined) row[field] = {};
            if (row[field] === null) row[field] = {};
            if (typeof row[field] === 'object') continue;
            if (typeof row[field] === 'string') eval("row['" + field + "'] = " + row[field]);
        }
    });

    return this;
}
DB3.prototype.formatRows = function(f) {
    if (this.rows === undefined || this.rows.length < 1) return this;
    if (typeof f !== 'function') return this;

    for (var i = 0; i < this.rows.length; i++) f(this.rows[i]);

    this._rowsBy(this.ret.fields, this.rows);

    return this;
}
DB3.prototype._rowsBy = function(fields, rows) {
    var rowsBy = {};
    fields.forEach(function(field) {
        if (rowsBy[field] === undefined) rowsBy[field] = {};
    });
    fields.forEach(function(field) {
        rows.forEach(function(row, i) {
            if (rowsBy[field][row[field]] === undefined) rowsBy[field][row[field]] = $.extend({
                _n_: -1
            }, row);

            rowsBy[field][row[field]]._n_++;
            var n = rowsBy[field][row[field]]._n_;

            rowsBy[field][row[field]][n] = row;
        });
    })
    this.ret.rowsBy = rowsBy;
    return this;
}
DB3.prototype._jSQL = function(sql) {
    //-----------------------------------------------------------
    
    var url = this.url + '?';
    url += 'd=' + encodeURIComponent(this.setting['dbname']) + '&';
    url += 'u=' + encodeURIComponent(this.setting['user']) + '&';
    url += 'p=' + encodeURIComponent(this.setting['pass']) + '&';
    url += 's=' + encodeURIComponent(this.setting['server']) + '&';
    url += '_=' + rand_string(5);

    try {
        var j = $.ajax({
            url: url,
            type: 'post',
            cache: false,
            async: false,
            data: {
                sql: encodeURIComponent(sql),
            },
            dataType: 'json',
            beforeSend: function() {},
            success: function(ret) {},
            error: function(ret) {},
            timeout: 2000,
        }).responseJSON;

        j['success'] = j != undefined && j.status;
        j['found'] = j['success'] && j.rows !== undefined && j.rows.length > 0;

        return j;
    } catch (e) {
        return e;
    }
}
DB3.prototype.SqlSet = function(input, delimiter = ',', prefix = null) {
    var ss = [];
    //-----------------------------------------------------------
    prefix = (prefix == null) ? "" : "`" + prefix + "`.";
    //-----------------------------------------------------------
    delimiter = delimiter.toUpperCase();
    //-----------------------------------------------------------
    $.each(input, function(f, value) {
        // console.log("field: " + f + " | value:" + value);

        if (typeof value === 'function') value = value();
        if (typeof value === 'array') value = "<IN> ('" + value.join("','") + "')";

        if (value == null) {
            if (['AND', 'OR'].has(delimiter)) ss.push(prefix + "`" + f + "` IS NULL");
            if (!['AND', 'OR'].has(delimiter)) ss.push(prefix + "`" + f + "`=NULL");
            return;
        }

        //-----------------------------------------------------------
        var uValue = value.toString().trim().toUpperCase();
        //-----------------------------------------------------------

        if (uValue.indexOf('!=') == 0 || uValue.indexOf('<>') == 0) {
            ss.push(prefix + "`" + f + "` " + value + "");
            return;
        }
        if (uValue.indexOf('<+>') == 0) {
            var xvalue = value.replace('<+>', '').trim();
            ss.push(prefix + "`" + f + "` = IFNULL(`" + f + "` + " + xvalue + ", " + xvalue + ")");
            return;
        }
        if (uValue.indexOf('<DATE_ADD>') == 0) {
            var interval = value.replace('<DATE_ADD>', '').trim();
            ss.push(prefix + "`" + f + "` = DATE_ADD(`" + f + "`, INTERVAL " + interval + ")");
            return;
        }
        if (uValue.indexOf('<NOW_ADD>') == 0) {
            var interval = value.replace('<NOW_ADD>', '').trim();
            ss.push(prefix + "`" + f + "` = DATE_ADD(NOW(), INTERVAL " + interval + ")");
            return;
        }
        if (uValue.indexOf('<->') == 0) {
            var xvalue = value.replace('<->', '').trim();
            ss.push(prefix + "`" + f + "` = IF(`" + f + "` IS NULL, " + xvalue + ", `" + f + "` - " + xvalue + ")");
            return;
        }
        if (uValue.indexOf('<LIKE>') == 0) {
            ss.push(prefix + "`" + f + "` " + value.replace('<LIKE>', 'LIKE ') + "");
            return;
        }
        if (uValue.indexOf('<IN>') == 0) {
            ss.push(prefix + "`" + f + "` " + value.replace('<IN>', 'IN ') + "");
            return;
        }
        if (uValue.indexOf('<IS>') == 0) {
            ss.push(prefix + "`" + f + "` " + value.replace('<IS>', 'IS ') + "");
            return;
        }
        if (uValue.indexOf('NOW()') == 0) {
            ss.push(prefix + "`" + f + "` = NOW() ");
            return;
        }
        if (uValue.indexOf('<FUNC>') == 0) {
            ss.push(value.replace('<FUNC>', '').trim());
            return;
        }
        if (uValue.indexOf('<RAW>') == 0) {
            ss.push(prefix + "`" + f + "`=" + value.replace('<RAW>', '') + "");
            return;
        }
        if (uValue.indexOf(' AGO>') > 0) {
            var tag = value.split('AGO >')[0].replace("<", "").trim();
            var unit = tag.split(" ")[0];
            var compare = value.split(' AGO>')[1].trim();
            ss.push("TIMESTAMPDIFF(" + unit + ", " + prefix + "`" + f + "`, NOW()) " + compare + "");
            return;
        }
        if (uValue.indexOf(':>') == 0) {
            var xvalue = value.replace(':>', '>').trim();
            ss.push(prefix + "`" + f + "`" + xvalue);
            return;
        }
        if (uValue.indexOf(':<') == 0) {
            var xvalue = value.replace(':<', '<').trim();
            ss.push(prefix + "`" + f + "`" + xvalue);
            return;
        }

        //-----------------------------------------------------------

        //-----------------------------------------------------------

        switch (typeof value) {
            case 'object':
                var xvalue = JSON.stringify(value);
                xvalue = (xvalue.length > 0) ? xvalue.replace(/\'/g, "\\'") : '';
                ss.push(prefix + "`" + f + "`='" + xvalue + "'");
                break;
            case 'number':
                ss.push(prefix + "`" + f + "`='" + value + "'");
                break;
            default:
                ss.push(prefix + "`" + f + "`='" + value.replace(/\'/g, "\\'") + "'");
                break;
        } // switch

    });

    if (delimiter != ',') {
        for (var i = 0; i < ss.length; i++) {
            ss[i] = "(" + ss[i] + ")";
        }
    }

    // console.log( ss.join(delimiter) );

    return ss.join(delimiter);
};


//+-----------------------------------------------------------------------------+
//| DB3Table                                                                     |
//+-----------------------------------------------------------------------------+
DB3Table = function(table, db, update_table) {

    this.table = table;
    this.update_table = (update_table === undefined) ? table : update_table;

    this.index = 'id';
    this.db = db;
    this.field = {};
    this.last_sql = null;
    this.column = null;
    this.rows = null;
    this.row = null;
    this.last_insert_id = null;
    this.total_affected_rows = null;

    this.unique_field = null;
    this.unique_function = null;

    this.row_functions = [];
    this.rows_functions = [];

    this.rows_filtered = [];
    this.row_filtered = null;

    this._default_fields = null;

    // this.load_preset_format();
};

//*******************************************************************************
//--- PRESET FORMAT
//*******************************************************************************
DB3Table.prototype.load_preset_format = function() {
    var url = this.db.url;
    var url_root = this.db.url.split("/")[2];
    var server = this.db.setting.server;
    var dbname = this.db.setting.dbname;
    var table = this.table;
    var match = [url_root, dbname, table].join("|");

    switch (match) {

        //--- lib.mixseo.net|gosme_project_SOCIAL -------------------
        case 'lib.mixseo.net|gosme_project_SOCIAL':
            this.defineUnique('unique', function(row) {
                return MD5([row.worker_task, row.meta_key].join("|"));
            });
            break;

            //--- 192.168.100.6|vli -------------------
        case '192.168.100.6|vli|_meta_contact':
            this.defineUnique('unique', function(row) {
                return MD5([row.contact, row.meta_group, row.meta_key].join(","));
            });
            break;
        case '192.168.100.6|vli|_meta_network':
            this.defineUnique('unique', function(row) {
                return MD5([row.network, row.meta_group, row.meta_key].join(","));
            });
            break;
        case '192.168.100.6|vli|_meta_site':
            this.defineUnique('unique', function(row) {
                return MD5([row.site, row.meta_group, row.meta_key].join(","));
            });
            break;
        case '192.168.100.6|vli|contact':
            this.defineUnique('unique', function(row) {
                return MD5([row.email, row.fb_user, row.fb_page, row.twitter_user].join(","));
            });
            break;
        case '192.168.100.6|vli|site':
            this.indexField('domain');
            break;

            //--- 192.168.100.6|livescore -------------------
        case '192.168.100.6|livescore|_meta_country':
            this.defineUnique('unique', function(row) {
                return MD5([row.country, row.meta_group, row.meta_key].join(","));
            });
            break;
        case '192.168.100.6|livescore|_meta_event':
            this.defineUnique('unique', function(row) {
                return MD5([row.event, row.meta_group, row.meta_key].join(","));
            });
            break;
        case '192.168.100.6|livescore|_meta_game':
            this.defineUnique('unique', function(row) {
                return MD5([row.game, row.meta_group, row.meta_key].join(","));
            });
            break;
        case '192.168.100.6|livescore|_meta_group':
            this.defineUnique('unique', function(row) {
                return MD5([row.group, row.meta_group, row.meta_key].join(","));
            });
            break;
        case '192.168.100.6|livescore|_meta_league':
            this.defineUnique('unique', function(row) {
                return MD5([row.league, row.meta_group, row.meta_key].join(","));
            });
            break;
        case '192.168.100.6|livescore|_meta_person':
            this.defineUnique('unique', function(row) {
                return MD5([row.person, row.meta_group, row.meta_key].join(","));
            });
            break;
        case '192.168.100.6|livescore|_meta_round':
            this.defineUnique('unique', function(row) {
                return MD5([row.round, row.meta_group, row.meta_key].join(","));
            });
            break;
        case '192.168.100.6|livescore|_meta_season':
            this.defineUnique('unique', function(row) {
                return MD5([row.season, row.meta_group, row.meta_key].join(","));
            });
            break;
        case '192.168.100.6|livescore|_meta_team':
            this.defineUnique('unique', function(row) {
                return MD5([row.team, row.meta_group, row.meta_key].join(","));
            });
            break;


            //--- 192.168.100.6|game -------------------------
        case '192.168.100.6|game|games':
            this.defineUnique('unique', function(row) {
                return MD5([row.slug, row.source].join(","));
            });
            this.rowsFormat(function(rows) {
                this.game = rows.toObjectBy('id');
            });
            this.rowFormat(function(row) {
                row.html_desc = row.desc.replace(/\\n/ig, "<br>");
                row.html_in_cat = `<div class="wsite-image wsite-image-border-none" style="padding-top:10px;padding-bottom:10px;margin-left:0px;margin-right:0px;text-align:center">
                    <a href="${row.href}">
                        <img style="width:auto;max-width:100%" alt="${row.title}" src="${row.cover}">
                        <div style="display:block;font-size:90%;padding-top:10px;">${row.title}</div>
                    </a>
                </div>`;
            });
            break;
        case '192.168.100.6|game|gamemeta':
            this.defineUnique('unique', function(row) {
                return MD5([row.game, row.meta_group, row.meta_key].join(","));
            });
            this.rowsFormat(function(rows) {
                this.game = rows.toObjectBy('game');
                this.meta_group = rows.toObjectBy('meta_group');
                this.meta_key = rows.toObjectBy('meta_key');
            });
            this.rowFormat(function(row) {
                if (row.meta_key == '_game_type') row.meta_value = row.meta_value.to_json();
                if (row.meta_key == '_game_technology') row.meta_value = row.meta_value.to_json();
                if (row.meta_group == '_tag') {
                    row.slug = `${row.meta_key}-tag`;
                    row.href = `/${row.slug}.html`;
                    row.html_link = `<a href='${row.href}' title='${row.meta_value}'>${row.meta_value}</a>`;
                }
                if (row.meta_group == '_category') {
                    row.slug = `${row.meta_key}-cat`;
                    row.href = `/${row.slug}.html`;
                    row.html_link = `<a href='${row.href}' title='${row.meta_value}'>${row.meta_value}</a>`;
                }
            });
            break;
        case '192.168.100.6|game|pagemeta':
            this.defineUnique('unique', function(row) {
                return MD5([row.page, row.meta_group, row.meta_key].join(","));
            });
            break;
        case '192.168.100.6|game|sitemeta':
            this.defineUnique('unique', function(row) {
                return MD5([row.site, row.meta_group, row.meta_key].join(","));
            });
            this.rowsFormat(function(rows) {
                this.get_value = function(meta_group, meta_key) {
                    var value = null;
                    rows.forEach(function(row) {
                        if (value != null) return;
                        if (row.meta_group == meta_group && row.meta_key == row.meta_key) value = row.meta_value;
                    });
                    return value;
                };
                this.get_values = function(meta_group) {
                    var values = [];
                    rows.forEach(function(row) {
                        if (value != null) return;
                        if (row.meta_group == meta_group) values.push(row.meta_value);
                    });
                    return values;
                };
            });
            break;
        case '192.168.100.6|game|page':
            this.defineUnique('unique', function(row) {
                return MD5([row.site, row.slug].join(","));
            });
            this.rowsFormat(function(rows) {
                this.games_id = rows.toArrayBy('game');
            });
            this.rowFormat(function(row) {
                row.html_link = `<a href='${row.publish_url}' title='${row.title.addslashes()}'>${row.title}</a>`;
            });
            break;
        case '192.168.100.6|game|_resource':
            this.rowsFormat(function(rows) {

                this.title = rows.toObjectBy('title');
            });
            break;
    }

    console.log("load_preset_format match = " + match, "lightgray");
}


//*******************************************************************************
//--- CORE FORMAT
//*******************************************************************************
DB3Table.prototype.indexField = function(new_index) {
    this.index = new_index;
    return this;
}
DB3Table.prototype.set_default_fields = function(new_default_fields) {
    this._default_fields = $.extend({}, new_default_fields);
    return this;
}
DB3Table.prototype.assignRowsTo = function(v) {
    if (v === undefined) v = {};
    v = $.extend({}, this.rows);
    return this;
}


DB3Table.prototype.filter = function(where) {
    var self = this;
    var i = 0;
    this.rows_filtered = [];
    this.rows.forEach(function(row, index) {
        var ok = true;
        for (var field in where) {
            if (is_array(where[field])) {
                ok &= where[field].indexOf(row[field]) >= 0;
            } else {
                ok &= row[field] == where[field];
            }
        }
        if (ok) {
            self.rows_filtered.push(row);
        }
    });
    this.row_filtered = (this.rows_filtered.length) ? this.rows_filtered[0] : false;
    return this.rows_filtered;
}
DB3Table.prototype.filter1st = function(where, value) {
    if (typeof where === 'object') return this.filter(where)[0];
    var ww = {};
    ww[where] = value;
    return this.filter(ww)[0];
}
DB3Table.prototype.query = function(sqls) {
    sqls = (sqls.length) ? sqls.join(";") : sqls;
    this.db.Query(sqls);
    if (this.db.ret.success) {
        this.total_affected_rows = this.db.ret.rowCount;
        return this.last_insert_id;
    }
    return false;
}


DB3Table.prototype.rowsFormat = function(f) {
    this.rows_functions.push(f);
    return this;
}
DB3Table.prototype.rowFormat = function(f) {
    this.row_functions.push(f);
    return this;
}
DB3Table.prototype._formatRows = function(rows) {
    if (rows == undefined) return null;

    var self = this;

    if (self.rows_functions.length) {
        for (var i = 0; i < self.rows_functions.length; i++) {
            self.rows_functions[i].apply(self, [rows]);
        }
    }

    var new_rows = [];
    rows.forEach(function(row_original) {
        var row = $.extend({}, row_original);

        if (self.row_functions.length) {
            for (var i = 0; i < self.row_functions.length; i++) {
                self.row_functions[i].apply(self, [row]);
            }
        }

        row.db = self.db;

        row.UpdateSQL = function(set) {

            return "UPDATE `" + self.update_table + "` SET " + self.db.SqlSet(set) + " WHERE `" + self.index + "`='" + this[self.index] + "' LIMIT 1 ";
        }
        row.Update = function(set) {
            var sql = this.UpdateSQL(set);
            console.log(sql, "lightgray");
            if (self.db.Query(sql).ret.success) {
                // $.extend(row, set);
                console.log("--- row.Update (#" + this[self.index] + ") : " + JSON.stringify(set) + " ", "lightgreen");
            } else {
                console.log("--- ERR: Row.Update", "red");
                console.log(self.db.ret);
            }
            return this;
        }

        new_rows.push(row);
    });


    return new_rows;
}


DB3Table.prototype.selectColumn = function(column, where, limit, orderby) {
    var self = this;
    this.db.Query(this.sql_selectColumn(column, where, limit, orderby));
    if (this.db.ret) {
        this.rows = this._formatRows(this.db.ret.rows);
        this.row = this.rows[0];

        this.column = {};
        this.column[column] = [];
        this.rows.forEach(function(row) {
            self.column[column].push(row[column]);
        });

        return this.rows;
    }
    return false;
}
DB3Table.prototype.selectRows = function(where, limit, orderby, groupby) {
    this.db.Query(this.sql_selectRows(where, limit, orderby, groupby));

    if (this.db.ret) {
        this.rows = this._formatRows(this.db.ret.rows);
        this.row = (this.rows == null) ? null : this.rows[0];
        return this.rows;
    }

    return false;
}
DB3Table.prototype.selectFirstRow = function(where, orderby) {
    var rows = this.selectRows(where, 1, orderby);
    return (rows.length) ? rows[0] : false;
}
DB3Table.prototype.insertRows = function(rows) {

}
DB3Table.prototype.insertRow = function(row) {
    this.db.Query(this.sql_insertRow(row));
    if (this.db.ret.success) {
        this.last_insert_id = this.db.ret.lastid;
        this.total_affected_rows = this.db.ret.rowCount;
        if (this.row !== null) this.selectFirstRow({
            id: (this.last_insert_id > 0) ? this.last_insert_id : this.row[this.index]
        });
        console.log("--- inserted : " + this.last_insert_id, "lightblue");
        return this.last_insert_id;
    }
    return false;
}
DB3Table.prototype.insertIgnoreRow = function(row) {
    this.db.Query(this.sql_insertIgnoreRow(row));
    if (this.db.ret.success) {
        this.last_insert_id = this.db.ret.lastid;
        this.total_affected_rows = this.db.ret.rowCount;
        if (this.row !== null) this.selectFirstRow({
            id: (this.last_insert_id > 0) ? this.last_insert_id : this.row[this.index]
        });
        console.log("--- inserted : " + this.last_insert_id, "lightblue");
        return this.last_insert_id;
    }
    return false;
}
DB3Table.prototype.insertUpdateRow = function(row, row_update) {
    this.db.Query(this.sql_insertUpdateRow(row, row_update));
    if (this.db.ret.success) {
        this.last_insert_id = this.db.ret.lastid;
        this.total_affected_rows = this.db.ret.rowCount;
        if (this.row !== null) this.selectFirstRow({
            id: (this.last_insert_id > 0) ? this.last_insert_id : this.row[this.index]
        });
        console.log("--- inserted : " + this.last_insert_id, "lightblue");
        return this.last_insert_id;
    }
    return false;
}
DB3Table.prototype.update = function(row, where, limit, orderby) {

    return this.updateRow(row, where, limit, orderby);
}
DB3Table.prototype.updateRow = function(row, where, limit, orderby) {
    this.db.Query(this.sql_updateRow(row, where, limit, orderby));
    if (this.db.ret.success) {
        $.extend(this.row, row);
        this.total_affected_rows = this.db.ret.rowCount;
        console.log("--- updated row : " + JSON.stringify(row), "lightblue");
        return true;
    }
    return false;
}


DB3Table.prototype.show_sql_selectColumn = function(column, where, limit, orderby) {
    this.sql_selectColumn(column, where, limit, orderby).__console.log("DB3Table.sql_selectColumn");
    return this;
}
DB3Table.prototype.show_sql_selectRows = function(column, where, limit, orderby, groupby) {
    this.sql_selectRows(column, where, limit, orderby, groupby).__console.log("DB3Table.show_sql_selectRows");
    return this;
}
DB3Table.prototype.show_sql_insertRow = function(row) {
    this.sql_insertRow(row).__console.log("DB3Table.show_sql_insertRow");
    return this;
}
DB3Table.prototype.show_sql_insertIgnoreRow = function(row) {
    this.sql_insertIgnoreRow(row).__console.log("DB3Table.show_sql_insertIgnoreRow");
    return this;
}
DB3Table.prototype.show_sql_updateRow = function(row) {
    this.sql_updateRow(row).__console.log("DB3Table.show_sql_updateRow");
    return this;
}


DB3Table.prototype.sql_selectColumn = function(column, where, limit, orderby) {
    var self = this;
    this.last_sql = "SELECT `" + column + "`, NOW() as now_ FROM `" + this.table + "` ";
    if (where != null && Object.keys(where).length) this.last_sql += " WHERE " + self.db.SqlSet(where, 'AND');
    if (orderby != null) this.last_sql += " ORDER BY " + orderby;
    if (limit != null) this.last_sql += " LIMIT " + limit;
    return this.last_sql;
}
DB3Table.prototype.sql_selectRows = function(where, limit, orderby, groupby) {
    var self = this;
    this.last_sql = "SELECT *, NOW() as now_ FROM `" + this.table + "` ";
    if (where != null && Object.keys(where).length) this.last_sql += " WHERE " + self.db.SqlSet(where, 'AND');
    if (orderby != null) this.last_sql += " ORDER BY " + orderby;
    if (groupby != null) this.last_sql += " GROUP BY " + groupby;
    if (limit != null) this.last_sql += " LIMIT " + limit;
    return this.last_sql;
}
DB3Table.prototype.sql_insertRow = function(row) {
    var self = this;
    this._setDefault(row);
    this._setUnique(row);
    this.last_sql = "INSERT INTO `" + this.update_table + "` SET " + self.db.SqlSet(row);
    return this.last_sql;
}
DB3Table.prototype.sql_insertIgnoreRow = function(row) {
    var self = this;
    this._setDefault(row);
    this._setUnique(row);
    this.last_sql = "INSERT IGNORE INTO `" + this.update_table + "` SET " + self.db.SqlSet(row);
    return this.last_sql;
};
DB3Table.prototype.sql_insertUpdateRow = function(row, row_update) {
    var self = this;
    this._setDefault(row);
    this._setUnique(row);
    this.last_sql = "INSERT INTO `" + this.update_table + "` SET " + self.db.SqlSet(row);
    if (row_update != null && Object.keys(row_update).length)
        this.last_sql += " ON DUPLICATE KEY UPDATE " + self.db.SqlSet(row_update);
    return this.last_sql;
};
DB3Table.prototype.sql_updateRow = function(row, where, limit, orderby) {
    var self = this;
    this.last_sql = "UPDATE `" + this.update_table + "` SET " + self.db.SqlSet(row);
    if (where != null && Object.keys(where).length) this.last_sql += " WHERE " + self.db.SqlSet(where, 'AND');
    if (orderby != null) this.last_sql += " ORDER BY " + orderby;
    if (limit != null) this.last_sql += " LIMIT " + limit;
    return this.last_sql;
}


DB3Table.prototype.defineUnique = function(unique_field, f) {
    this.unique_field = unique_field;
    this.unique_function = f;
    return this;
    //-- Example : DB3Table.defineUnique('unique', function(row) {});
};
DB3Table.prototype._setDefault = function(row) {
    if (this._default_fields == null) return;

    var _default_fields = $.extend({}, this._default_fields);
    for (var f in _default_fields) {
        if (row[f] !== undefined) return;
        // if (typeof _default_fields[f] === 'function') _default_fields[f] = _default_fields[f]();

        // if (f == 'time_logged') _Var(f, _default_fields[f]);

        row[f] = _default_fields[f];
    }

    return this;
};
DB3Table.prototype._setUnique = function(row) {
    if (this.unique_field == null) return;
    if (!is_func(this.unique_function)) return;

    row[this.unique_field] = this.unique_function.apply(this, [row]);
    return this;
};

DB3Table.prototype.console_log = function(note) {
    _Var(`${this.table} (--${note}--)`, this);
    return this;
};

isset = function(a) {
    return a !== undefined && a !== null;
}

is_array = function(a) {
    return typeof a == 'object' && a.length > 0;
}


//+-----------------------------------------------------------------------------+
//|	RAND 																		|
//+-----------------------------------------------------------------------------+
RAND = {
    Happen: function(percent) {
        var r = RAND.Between(1, 100) / 100;
        _(r + " vs " + percent);
        return percent <= r;
    },
    Between: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    String: function(l = 5, possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") {
        var text = "";
        for (var i = 0; i < l; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },
    Number: function(l = 5) {
        return RAND.String(l, "0123456789");
    },
    ArrayItem: function(arr) {
        return arr[RAND.Between(1, arr.length) - 1];
    },
    ObjectItem: function(obj) {
        var key = RAND.ArrayItem(Object.keys(obj));
        return obj[key];
    },
    Element: function(obj) {
        var r = RAND.Between(1, obj.length) - 1;
        return obj.eq(r);
    },
    ItemByWeight: function(input) {
        if (input['list'] == undefined) return Err("input.list is undefined");
        //----------------------------------------------------
        var o;
        //----------------------------------------------------
        var key_weight = (input['key_weight'] == undefined) ? 'weight' : input['key_weight'];
        var weight_multiply = (input['weight_multiply'] == undefined) ? 100 : input['weight_multiply'];
        //_Var("key_weight", key_weight);
        //----------------------------------------------------
        var total_weight = 0;
        for (var i = 0; i < input['list'].length; i++) {
            total_weight += input['list'][i][key_weight] * weight_multiply;
        }
        //_Var("total_weight", total_weight);
        //----------------------------------------------------
        var sortable = [];
        for (var i in input['list']) {
            sortable.push([input['list'][i], input['list'][i][key_weight] * weight_multiply]);
        }
        //_Var("sortable", sortable);
        sortable.sort(function(a, b) {
            return b[1] - a[1];
        });
        //_Var("sortable", sortable);
        //----------------------------------------------------
        var rand = RAND.Between(1, total_weight);
        //_Var("rand", rand);
        for (var j in sortable) {
            rand -= sortable[j][1];
            if (rand <= 0) {
                o = sortable[j][0];
                break;
            }
        }
        //----------------------------------------------------
        return o;
        //----------------------------------------------------
        if (0) {
            var input_example = [{
                'id': 'a1',
                'weight': 100,
            }, {
                'id': 'a2',
                'weight': 90,
            }, {
                'id': 'a4',
                'weight': 50,
            }, {
                'id': 'a5',
                'weight': 10,
            }, {
                'id': 'a3',
                'weight': 90,
            }, ];

            var o = RAND.ItemByWeight({
                'list': input_example,
                'key_weight': 'weight',
                'weight_multiply': 10,
            });

        }
    },
}
WPDB = (class WPDB {
    constructor (dburl, dbuser, dbpassword, dbname, dbhost) {
        if (typeof dburl === 'string') {
            this.dburl                  = dburl;
            this.dbuser                 = dbuser;
            this.dbpassword             = dbpassword;
            this.dbname                 = dbname;
            this.dbhost                 = dbhost || "localhost";
        } else {
            this.dburl                  = dburl.url;
            this.dbuser                 = dburl.user;
            this.dbpassword             = dburl.pass;
            this.dbname                 = dburl.dbname;
            this.dbhost                 = dburl.host || "localhost";
        }
        
        this._charset;
        
        this._is_debug              = false;
        this._is_connecting         = false;
        
        this._show_errors           = false;
        this._suppress_errors       = false;
        this._last_error            = '';
        this._num_queries           = 0;
        this._num_rows              = 0;
        this._rows_affected         = 0;
        this._insert_id             = 0;
        this._col_info              = null;
        
        this._last_query;
        this._last_result;
        this._return_value;
        this._result;
        
        this._func_call;
    }
    
    //--- INIT ---//
    prepare (query, values) {
        
    }
    
    //--- SELECT a Variable ---//                                               https://developer.wordpress.org/reference/classes/wpdb/#select-a-variable
    __BETA__get_var (query = null, column_offset = 0, row_offset = 0) {
        
    }

    //--- SELECT a Row ---//                                                    https://developer.wordpress.org/reference/classes/wpdb/#select-a-row
    get_row (query, output_type = WPDB.OBJECT, row_offset = 0) {
        if (!query) return null;
        
        this.query( query );
        
        if (!this._last_result[row_offset]) {
            return null;
        }
        
        switch (output_type) {
            case WPDB.OBJECT: {
                return this._last_result[row_offset] || null; 
            }
            case WPDB.FIELDS: {
                return Object.keys(this._last_result[row_offset]) || null; 
            }
            case WPDB.VALUES: {
                return Object.values(this._last_result[row_offset]) || null; 
            }
            default: {
                return this._last_result[row_offset] || null; 
            }
        }
    } 
    
    //--- SELECT a Column ---//                                                 https://developer.wordpress.org/reference/classes/wpdb/#select-a-column
    __BETA__get_col (query, column_offset = 0) {
        if (!query) return null;
        
        this.query( query );
        
        console.log("WHEELKJ");
        
        if (!this._last_result) {
            return null;
        }
        
        var new_array = [];
        
        return this._last_result;
    }
    
    //--- SELECT Generic Results ---//                                          https://developer.wordpress.org/reference/classes/wpdb/#select-generic-results
    get_results (query, output_type = WPDB.OBJECT) {
        if (!query) return null;
        
        return this.query( query );
        
        //----- REMOVE BELOW -------
        if (!this._last_result) {
            return null;
        }
        
        var new_array = [];
        switch (output_type) {
            case WPDB.OBJECT: {
                this._last_result.forEach(row => {
                    new_array.push(row);
                })
                return new_array;
            }
            case WPDB.OBJECT_K:
            case WPDB.FIELDS: {
                return Object.keys(this._last_result[0]) || null; 
            }
            case WPDB.VALUES: {
                this._last_result.forEach(row => {
                    new_array.push( Object.values(row) );
                })
                return new_array;
            }
            default: {
                return this._last_result || null; 
            }
        }
    }
    
    //--- SELECT rows ---//                                                      
    select (table, fields, where, limit = null, order = null, group = null) {
        return this.query( this.sql_select (table, fields, where, limit, order, group) );
    }
    
    //--- INSERT row ---//                                                      https://developer.wordpress.org/reference/classes/wpdb/#insert-row
    insert (table, data, format) {
        return this._insert_replace_helper( table, data, null, format, 'INSERT');
    }
    insert_update (table, data, update_data, format) {
        return this._insert_replace_helper( table, data, update_data, format, 'INSERT');
    }
    
    //--- REPLACE row ---//                                                     https://developer.wordpress.org/reference/classes/wpdb/#replace-row
    replace (table, data, format) {
        return this._insert_replace_helper( table, data, null, format, 'REPLACE');
    }
    
    //--- UPDATE rows ---//                                                     https://developer.wordpress.org/reference/classes/wpdb/#update-rows
    update (table, data, where, limit = null, format = null, where_format = null) {
        return this.query( this.sql_update (table, data, where, limit, format, where_format) );
    }
    
    //--- DELETE rows ---//                                                     https://developer.wordpress.org/reference/classes/wpdb/#delete-rows
    delete (table, where, where_format = null) {
        where = this._process_fields(table, where, where_format);
        if (where === false) return false;
        
        var conditions = [];
        for (var field in where) {
            var value = where[field];
            var operator = value.operator;
            conditions.push( "`"+field+"`"+operator+""+value.in_sql+"" );
        }
        
        var sql = "DELETE FROM `"+table+"` WHERE "+conditions.join(" AND ");
        
        return this.query( sql );
    }
    
    
    //--- SQL SELECT ---//        
    sql_select (table, fields, where, limit = null, order = null, group = null) {
        if (fields === null) fields = "*";
        // if (typeof fields == 'object'  &&  fields.length > 0) fields = "`"+fields.join("`,`")+"`";
        
        where = JSON.parse(JSON.stringify(where));
        where = this._process_fields(table, where);
        if (where === false) return false;
        
        var conditions = [];
        for (var field in where) {
            var value = where[field];
            var operator = value.operator;
            if (value.condition === undefined) {
                conditions.push( "`"+field+"`"+operator+""+value.in_sql+"" );
            } else {
                conditions.push( value.condition );
            }
        }
        
        group = (group !== null) ? " GROUP BY " + group : "";
        order = (order !== null) ? " ORDER BY " + order : "";
        limit = (limit !== null) ? " LIMIT " + limit : "";
        
        var sql = "SELECT "+fields+" FROM `"+table+"` WHERE "+conditions.join(" AND ")+group+order+limit;
        
        return sql;
    }
    //--- SQL INSERT row ---//        
    sql_insert_update (table, data, update_data, format) {
        return this._sql_insert_replace_helper( table, data, update_data, format, 'INSERT');
    }
    //--- SQL UPDATE rows ---//                                                     https://developer.wordpress.org/reference/classes/wpdb/#update-rows
    sql_update (table, data, where, limit = null, format = null, where_format = null) {
        data = this._process_fields(table, data, format);
        if (data === false) return false;
        
        where = JSON.parse(JSON.stringify(where));
        where = this._process_fields(table, where, where_format);
        if (where === false) return false;
        
        var sets = [];
        for (var field in data) {
            var value = data[field];
            var operator = value.operator;
            if (value.value === null) operator = '=';
            sets.push( "`"+field+"`"+operator+""+value.in_sql+"" );
        }
        
        var conditions = [];
        for (var field in where) {
            var value = where[field];
            var operator = value.operator;
            if (value.condition === undefined) {
                conditions.push( "`"+field+"`"+operator+""+value.in_sql+"" );
            } else {
                conditions.push( value.condition );
            }
        }
        
        var sql = "UPDATE `"+table+"` SET "+sets.join(",")+" WHERE "+conditions.join(" AND ");
        
        if (limit > 0) sql += " LIMIT " + limit;
        
        return sql;
    }


    //--- Running General Queries ---//                                         https://developer.wordpress.org/reference/classes/wpdb/#running-general-queries
    query (sql) {
        
        sql = typeof sql === 'object' 
            ? sql.filter(s => s[0] != '#').join(";")
            : sql;
        
        if (sql.trim().length < 1) return this;
        
        // format sql with arguments
        
        this.flush();
        
        this._func_call = "query";
        
        this._last_query = sql;
        
        if (this._is_debug) console.log("sql", sql);
        
        this._do_query( sql );
        
        if (this._last_error) {
            this._insert_id = 0;
            this.print_error();
            return this;
        }
        
        // console.log("this._result", this._result)
        
        if (this._result.status) {
            this._return_value = null;
            if (sql.match(/^\s*(create|alter|truncate|drop)\s/i)) {
                this._return_value = this._result;
            } else if (sql.match(/^\s*(insert|delete|update|replace)\s/i)) {
                this._rows_affected = this._result.rowCount;
                if (sql.match(/^\s*(insert|replace)\s/i)) {
                    this._insert_id = this._result.lastid * 1;
                }
                this._return_value = this._rows_affected;
            } else {
                if (this._result.rows != undefined && this._result.rows.length) {
                    this._last_result = [].concat(this._result.rows);
                    this._num_rows = this._result.rows.length;
                    this._return_value = this._result.rows.length;
                }
            }
        }
        
        return this;
    }
    
    then (f) {
        if (typeof f !== 'function') return this;
        
        if (this._last_query.match(/^\s*(create|alter|truncate|drop)\s/i)) {
            f.apply(this, [this._return_value]);
        } else if (this._last_query.match(/^\s*(insert|delete|update|replace)\s/i)) {
            if (this._last_query.match(/^\s*(insert|replace)\s/i)) {
                f.apply(this, [this._insert_id]);
            } else {
                f.apply(this, [this._rows_affected]);
            }
        } else {
            f.apply(this, [this._last_result, this._num_rows, this._return_value]);
        }
        return this;
    }
    
    
    
    //--- Clearing the Cache ---//                                              https://developer.wordpress.org/reference/classes/wpdb/#clearing-the-cache
    flush () {
        this._last_result       = [];
        this._col_info          = null;
        this._last_query        = null;
        this._rows_affected     = 0;
        this._num_rows          = 0;
        this._last_error        = null;
        
        return this;
    }
    
    
    show_last_query () {
        console.log( this._last_query )
        return this;
    }
    
    
    
    //--- Show and Hide SQL Errors ---//                                        https://developer.wordpress.org/reference/classes/wpdb/#show-and-hide-sql-errors
    show_errors ()  {
        this._show_errors = true;
    }
    hide_errors ()  {
        this._show_errors = false;
    }
    print_error ()  {
        console.log( this._last_error );
    }
    debug ()        { 
        this._is_debug = true; return this;
    }
    

    
    get insert_id () {
        return this._insert_id;
    }
    get last_error () {
        return this._last_error;
    }
    get rows () {
        return this._last_result;
    }
    get row () {
        return this._last_result[0];
    }

    
    //--- STATIC ---//
    static get OBJECT()             { return "WPDB_OBJECT" }
    static get OBJECT_K()           { return "WPDB_OBJECT_K" }
    static get ARRAY_A()            { return "WPDB_ARRAY_A" }
    static get ARRAY_N()            { return "WPDB_ARRAY_N" }
    static get FIELDS()             { return "WPDB_FIELDS" }
    static get VALUES()             { return "WPDB_VALUES" }
    static get NOW()                { return "WPDB_NOW" }
    static get UNIX_TIMESTAMP()     { return "WPDB_UNIX_TIMESTAMP" }
    static get UNIX_NOW()           { return "WPDB_UNIX_TIMESTAMP" }
    
    
    
    //--- PRIVATE ---//
    //--- SQL ---//
    _sql_insert_replace_helper (table, data, update_data, format = null, type = 'INSERT') {
        this._insert_id = 0;
        
        if ( ['REPLACE', 'INSERT', 'INSERT UPDATE'].indexOf( type.toUpperCase() ) < 0 ) {
            return false;
        }
        
        data = this._process_fields(table, data, format);
        if (data === false) return false;
        
        var sets = [];
        for (var field in data) {
            var value = data[field];
            var operator = value.operator;
            if (value.value === null) operator = '=';
            sets.push( "`"+field+"`"+operator+""+value.in_sql+"" );
        }
        
        var sql = ""+type+" INTO `"+table+"` SET "+sets.join(",")+" ";
        
        if (update_data !== null) {
            update_data = this._process_fields(table, update_data, format);
            
            sets = [];
            for (field in update_data) {
                value = update_data[field];
                operator = value.operator;
                if (value.value === null) operator = '=';
                sets.push( "`"+field+"`"+operator+""+value.in_sql+"" );
            }
            
            sql += " ON DUPLICATE KEY UPDATE "+sets.join(",")+" ";
        }
        
        // console.log("SQL _insert_replace_helper : ", sql);    
        
        return sql;
    }
    
    //--- PRIVATE ---//
    _insert_replace_helper (table, data, update_data, format = null, type = 'INSERT') {
        var sql = this._sql_insert_replace_helper(table, data, update_data, format, type);
        
        console.log("SQL _insert_replace_helper : ", sql);    
        
        return this.query( sql );
    }
    _process_fields (table, data, format) {
        
        //console.log("data", data);

        data = this._process_fields_formats(data, format);
        if (data === false) return false;
        //console.log("data after _process_fields_formats", data);
        
        
        data = this._process_field_charsets(data, table);
        if (data === false) return false;
        //console.log("data after _process_field_charsets", data);
        
        
        data = this._process_field_lengths(data, table);
        if (data === false) return false;
        //console.log("data after _process_field_lengths", data);
        
        
        data = this._process_sql_value(data, table);
        if (data === false) return false;
        //console.log("data after _process_sql_value", data);
        
        
        var converted_data = this._strip_invalid_text (data);
        //console.log("converted_data", converted_data);
        
        
        return data;
    }
    _process_fields_formats (data, format) {
        var formats             = [].concat(format);
        var original_formats    = [].concat(formats);
        
        for (var field in data) {
            var value = {
                'value'     : data[field],
                'format'    : '%s',
            };
            
            if (format) {
                value.format = formats.shift();
                if (!value.format) {
                    value.format = original_formats[0];
                }
            }
            
            switch (format) {
                case '%d': value.value = value.value * 1; break;
            }
            
            data[field] = value;
        }
        
        return data;
    }
    _process_field_charsets (data, table) {
        for (var field in data) {
            var value = data[field];
            //------------------------------------------------------------------
            if (value.format == '%d'  ||  value.format == '%f') {
                value.charset = false;
            } else {
                value.charset = 'column charset';
            }
            //------------------------------------------------------------------
            data[field] = value;
        }
        
        return data;
    }
    _process_field_lengths (data, table) {
        for (var field in data) {
            var value = data[field];
            //------------------------------------------------------------------
            if (value.format == '%d'  ||  value.format == '%f') {
                value.charset = false;
            } else {
                value.charset = 'column length';
            }
            //------------------------------------------------------------------
            data[field] = value;
        }
        
        return data;
    }
    _process_sql_value (data) {
        for (var field in data) {
            var value = data[field];
            //------------------------------------------------------------------
            value.in_sql = null;
            
            if (value.value === null) {
                value.operator = " IS ";
                value.in_sql = "NULL";
            } else {
                value.operator = "=";
                
                switch (typeof value.value) {
                    case 'object':
                        for (var op in value.value) {
                            
                            value.operator = "=";
                            
                            switch (op.toLowerCase()) {
                                case 'is_not_null':
                                case 'is not null':
                                    value.operator = "";
                                    value.in_sql = ` IS NOT NULL`;
                                    break;
                                case 'unix_now_add':
                                    value.in_sql = `UNIX_TIMESTAMP() + ${value.value[op]}`;
                                    break;
                                case 'now_add':
                                    value.in_sql = `DATE_ADD(NOW(), INTERVAL ${value.value[op]})`;
                                    break;
                                case 'date_add':
                                    value.in_sql = `DATE_ADD(\`${field}\`, INTERVAL ${value.value[op]})`;
                                    break;
                                case 'if_exist_is_null':
                                    value.in_sql = `IF(\`${field}\` IS NULL, ${this._value(value.value[op])}, \`${field}\`)`;
                                    break;
                                case '+':
                                    value.in_sql = `\`${field}\`+${value.value[op]}`;
                                    break;
                                case 'or':
                                    var ors = value.value[op];
                                    ors = ors.map(v => {
                                        if (typeof v === 'function') v = v.apply(this);
                                        if (v === null) return `\`${field}\` IS NULL`;
                                        if (typeof v === 'object') return `\`${field}\` ${Object.keys(v)[0]} ${this._value(Object.values(v)[0])}`;
                                        return `\`${field}\` = '`+v+`'`;
                                    })
                                    value.condition = `(`+ors.join(" OR ")+`)`;
                                    break;
                                case 'in':
                                    value.operator = " IN ";
                                    var arr = typeof value.value['in'] === 'string' ? value.value['in'].split(",") : value.value['in'];
                                    var in_values = arr.map(v => {return v.toString().addslashes()})
                                    value.in_sql = `('`+in_values.join(`','`)+`')`;
                                    break;
                                default: 
                                    value.operator = op.toUpperCase();
                                    
                                    switch (typeof value.value[op]) {
                                        case 'number'   : value.in_sql = ``+value.value[op]+``;     break;
                                        default         : value.in_sql = `'`+value.value[op]+`'`;   break;
                                    }
                                    
                                    break;
                            }
                        }
                        break;
                    case 'string':
                        switch (value.value) {
                            case WPDB.UNIX_TIMESTAMP:
                                value.in_sql = `UNIX_TIMESTAMP()`;
                                break;
                            case WPDB.NOW:
                                value.in_sql = `NOW()`;
                                break;
                            default: 
                                value.in_sql = `'${value.value.addslashes()}'`;
                                break;
                        }
                        break;
                    case 'number':
                        value.in_sql = `${value.value}`;
                        break;
                    default: 
                        value.in_sql = `'${value.value}'`;
                        break;
                }
            }
            //------------------------------------------------------------------
            data[field] = value;
        }
        return data;
    }
    _value (value) {
        var output = value;
        switch (typeof value) {
            case 'object':
                for (var op in value) {
                    switch (op.toLowerCase()) {
                        case 'now_add':
                            output = `DATE_ADD(NOW(), INTERVAL ${value[op]})`;
                            break;
                        case 'date_add':
                            output = `DATE_ADD(\`${field}\`, INTERVAL ${value[op]})`;
                            break;
                        case 'unix_now_add':
                            output = `UNIX_TIMESTAMP() + ${value[op]}`;
                            break;
                        case 'if_exist_is_null':
                            output = `IF(\`${field}\` IS NULL, ${this._value(value[op])}, \`${field}\`)`;
                            break;
                        case '+':
                            output = `\`${field}\`+${value[op]}`;
                            break;
                        case 'or':
                            var ors = value[op];
                            ors = ors.map(v => {
                                if (typeof v === 'function') v = v.apply(this);
                                if (v === null) return `\`${field}\` IS NULL`;
                                if (typeof v === 'object') return `\`${field}\` ${Object.keys(v)[0]} ${Object.values(v)[0]}`;
                                return `\`${field}\` = '`+v+`'`;
                            })
                            output = `(`+ors.join(" OR ")+`)`;
                            break;
                        case 'in':
                            var arr = typeof value['in'] === 'string' ? value['in'].split(",") : value[op];
                            var in_values = arr.map(v => {return v.toString().addslashes()})
                            output = `('`+in_values.join(`','`)+`')`;
                            break;
                        default: 
                            switch (typeof value[op]) {
                                case 'number'   : output = ``+value[op]+``;     break;
                                default         : output = `'`+value[op]+`'`;   break;
                            }
                            break;
                    }
                }
                break;
            case 'string':
                switch (value) {
                    case WPDB.UNIX_TIMESTAMP:
                        output = `UNIX_TIMESTAMP()`;
                        break;
                    case WPDB.NOW:
                        output = `NOW()`;
                        break;
                    default: 
                        output = `'${value.addslashes()}'`;
                        break;
                }
                break;
            case 'number':
                // output = `${value}`;
                // break;
            default: 
                output = `'${value}'`;
                break;
        }
        return output;
    }
    _strip_invalid_text (data) {
        for (var field in data) {
            var value = data[field];
            //------------------------------------------------------------------
            if (typeof value.value !== 'string') continue;
            //------------------------------------------------------------------
            data[field] = value;
        }
        
        return data;
    }
    
    
    
    _do_query (sql) {
        try {
            var url = this.dburl + '?';
            url += 'd=' + encodeURIComponent(this.dbname) + '&';
            url += 'u=' + encodeURIComponent(this.dbuser) + '&';
            url += 'p=' + encodeURIComponent(this.dbpassword) + '&';
            url += 's=' + encodeURIComponent(this.dbhost) + '&';
            url += '_=' + rand_string(5);
            
            this._result = $.ajax({
                url: url,
                type: 'post',
                cache: false,
                async: false,
                data: {
                    sql: encodeURIComponent(sql),
                },
                dataType: 'json',
                beforeSend: function() {},
                success: function(ret) {},
                error: function(ret) {},
                timeout: 2000,
            }).responseJSON;
            
            this._num_queries ++;
        } catch (e) {
            this._last_error = e;
        }
    }
    
    test () {
        this.query("SELECT TABLE_NAME, NOW() as now_ FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA='" + this.dbname + "'");
        
        this._is_connecting = true;
        
        return this;
    }
})
IIM = (class IIM {
    constructor () {
        jsLF = "\n";
    }
    
    static LOAD_URL (url, timeout_page = 5) {
        var code = "CODE: \n";
        code += IIM.SET_TIMEOUT_PAGE(timeout_page) + jsLF;
        code += `URL GOTO=${url}` + jsLF;
        code += "WAIT SECONDS=0.1" + jsLF;
        iimPlay(code);
        return true;
    }
    
    static PAUSE () {
        var code = "CODE: ";
        code += "PAUSE" + jsLF;
        return iimPlay(code);
    }
    static DELAY (sec, timeout_page = null, note = '') {
        var code = "CODE: ";
        code += note !== '' ? `'-- ${note} --` + jsLF : '';
        code += timeout_page !== null ? IIM.SET_TIMEOUT_PAGE(timeout_page) + jsLF : '';
        code += "WAIT SECONDS=" + sec + jsLF;
        return iimPlay(code);
    }
    
    
    static MOUSEOVER (e, timeout_tag = 3) {
        var code = "CODE: ";
        code += IIM.SET_HEAD() + jsLF;
        code += IIM.SET_TIMEOUT_TAG(timeout_tag) + jsLF;
        code += IIM.SET_FRAME(e.iframe) + jsLF;
        code += `TAG POS=1 TYPE=* ATTR=XID:${IIM.XID(e)} CONTENT=EVENT:MOUSEOVER` + jsLF;
        code += IIM.SET_FOOT();
        
        console.log("MOUSEOVER\n", code)
        
        return iimPlay(code);
    }
    
    
    static FILL (e, value, timeout_tag = 3) {
        var code = "CODE: ";
        code += IIM.SET_HEAD() + jsLF;
        code += IIM.SET_TIMEOUT_TAG(timeout_tag) + jsLF;
        code += IIM.SET_FRAME(e.iframe) + jsLF;
        code += `TAG POS=1 TYPE=* ATTR=XID:${IIM.XID(e)} CONTENT="${value}"` + jsLF;
        code += IIM.SET_FOOT();
        
        //console.log("CLICK\n", code)
        
        return iimPlay(code);
    }
    
    
    static CLICK (e, timeout_tag = 3) {
        var code = "CODE: ";
        code += IIM.SET_HEAD() + jsLF;
        code += IIM.SET_TIMEOUT_TAG(timeout_tag) + jsLF;
        code += IIM.SET_FRAME(e.iframe) + jsLF;
        code += `TAG POS=1 TYPE=* ATTR=XID:${IIM.XID(e)}` + jsLF;
        code += IIM.SET_FOOT();
        
        //console.log("CLICK\n", code)
        
        return iimPlay(code);
    }
    static CLICK_DOWNLOAD (e, path, filename, timeout_tag = 3) {
        var code = "CODE: ";
        code += IIM.SET_HEAD() + jsLF;
        code += IIM.SET_TIMEOUT_TAG(timeout_tag) + jsLF;
        code += IIM.SET_FRAME(e.iframe) + jsLF;
        code += `ONDOWNLOAD FOLDER="${path}" FILE="${filename}" WAIT=YES` + jsLF;
        code += `TAG POS=1 TYPE=* ATTR=XID:${IIM.XID(e)}` + jsLF;
        code += IIM.SET_FOOT();
        
        //console.log("CLICK_DOWNLOAD\n", code)
        
        return iimPlay(code);
    }
    
    static EVENT_CLICK (e, timeout_tag = 3) {
        var code = "CODE: ";
        code += IIM.SET_HEAD() + jsLF;
        code += IIM.SET_TIMEOUT_TAG(timeout_tag) + jsLF;
        code += IIM.SET_FRAME(e.iframe) + jsLF;
        code += `EVENT TYPE=CLICK SELECTOR="[xid=${IIM.XID(e)}]" BUTTON=0` + jsLF;
        code += IIM.SET_FOOT();
        
        // console.log("code", code)
        
        return iimPlay(code);
    }
    static EVENT_CLICK_DOWNLOAD (e, path, filename, timeout_tag = 3) {
        var code = "CODE: ";
        code += IIM.SET_HEAD() + jsLF;
        code += IIM.SET_TIMEOUT_TAG(timeout_tag) + jsLF;
        code += IIM.SET_FRAME(e.iframe) + jsLF;
        code += `ONDOWNLOAD FOLDER="${path}" FILE="${filename}" WAIT=YES` + jsLF;
        code += `EVENT TYPE=CLICK SELECTOR="[xid=${IIM.XID(e)}]" BUTTON=0` + jsLF;
        code += IIM.SET_FOOT();
        
        // console.log("EVENT_CLICK_DOWNLOAD", code)
        
        return iimPlay(code);
    }
    static EVENT_FILL (e, value, timeout_tag = 3) {
        if (value == null) return false;
        
        var code = "CODE: ";
        code += IIM.SET_HEAD() + jsLF;
        code += IIM.SET_TIMEOUT_TAG(timeout_tag) + jsLF;
        code += IIM.SET_FRAME(e.iframe) + jsLF;
        code += `EVENTS TYPE=KEYPRESS SELECTOR="[xid=${IIM.XID(e)}]" CHARS="${value.toString().addslashes()}"` + jsLF;
        code += IIM.SET_FOOT();
        
        // console.log("code", code)
        
        return iimPlay(code);
    }
    
    
    static SET_HEAD () {
        return `
ONDIALOG POS=1 BUTTON=OK CONTENT=
SET !ENCRYPTION NO
SET !REPLAYSPEED FAST
SET !ERRORIGNORE YES
SET !EXTRACT_TEST_POPUP NO
        `.trim();
    }
    static SET_FOOT () {
        return `
TAB T=1
        `.trim();
    }
    static SET_TIMEOUT_PAGE (timeout) {
        return timeout > 0 ? `SET !TIMEOUT_PAGE ${timeout}` + jsLF : ``;
    }
    static SET_TIMEOUT_TAG (timeout) {
        return timeout > 0 ? `SET !TIMEOUT_TAG ${timeout}` + jsLF : ``;
    }
    
    
    static SET_FRAME (e) {
        if (e == null) return ``;
        var iframe = IIM.$(e);
        var name = "iframe_" + rand_string(16);
        
        if (iframe.attr('name') != null) {
            return `FRAME NAME=${iframe.attr('name')}`;
        } else {
            iframe.attr('name', name);
            return `FRAME NAME=${iframe.attr('name')}`;
        }
    }
    static XID (e, prefix = null) {
        var xid = rand_string(32);
        var ee = IIM.$(e);              
        
        // console.log("ee", ee, typeof ee, ee.attr('xid'))
        
        if (typeof ee !== 'object') return null;
        if (ee.attr('xid') != null) return ee.attr('xid');
        ee.attr('xid', prefix != null ? prefix + "_" + xid : xid);
        return xid;
    }
    
    static $ (e) {
        var ee = e;
        if (typeof e === 'string') ee = $(e);
        if (typeof e === 'object') {
            if (typeof e.e === 'string') {
                if (typeof e.iframe === 'string') ee = $(e.iframe).contents().find(e.e);
                if (typeof e.iframe === 'object') ee = e.iframe.contents().find(e.e);
                if (e.iframe == null) ee = this.$(e.e);
            }
            if (typeof e.e === 'object') {
                if (typeof e.iframe === 'string') ee = $(e.iframe).contents().find(e.e.selector);
                if (typeof e.iframe === 'object') ee = e.iframe.contents().find(e.e.selector);
                if (e.iframe == null) ee = this.$(e.e);
            }
        }
        return ee;
    }
})

jsLF = "\n";
$.fn.hide_important = function() {
    $(this).css({"display": "none !important"});
    return this;
};
$.fn.map = function(f) {
    var aa = [];
    for (var i=0; i<$(this).length; i++) {
        aa.push(f.apply(this, [$(this).eq(i), i]))
    }
    return aa;
};
$.fn.forEach = function(f) {
    for (var i=0; i<$(this).length; i++) {
        f.apply(null, [$(this).eq(i), i]);
    }
    return this;
};
$.fn.clear = function() {
    $(this).html("");
    return this;
};
$.fn.enable = function() {
    $(this).prop('disabled', false);
    return this;
};
$.fn.disable = function() {
    $(this).prop('disabled', true);
    return this;
};
$.fn.href = function(url) {
    if (url==undefined) return $(this).attr('href');

    $(this).attr('href', url);
    return this;
};
$.fn.target = function(target) {
    $(this).attr('target', target);
    return this;
};
$.fn.style = function(style) {
    var ss = ($(this).attr('style') != undefined) ? $(this).attr('style').split(";") : [];
    var ss_new = style.split(";");
    $(this).attr('style', $.extend(ss, ss_new).join(";"));
    return this;
};
$.fn.blink = function(duration = 500) {
    var e = $(this)
    e.fadeOut('fast', function(){
        e.fadeIn('slow', function(){});
    });
    // switch ($(this).prop('tagName')) {
    //   default: $(this).fadeOut(duration/2).fadeIn(duration/2); break;
    // }
};
$.fn.blink_on_click = function(duration = 500) {
    $(this).click(function() {
        var e = $(this)
        e.fadeOut('fast', function(){
            e.fadeIn('slow', function(){});
        });
    })
};
$.fn.selected_option = function() {
    if ($(this).prop('tagName') != 'SELECT') return this;

    return $(this).find("option:selected");
};
$.fn.remove_option = function(selector) {
    if ($(this).prop('tagName') != 'SELECT') return this;

    $(this).find(`option${selector}`).remove();

    return $(this);
};
$.fn.add_options = function(data, setting) {
    if ($(this).prop('tagName') != 'SELECT') return this;

    if (typeof data === 'string') {     // value:text,value:text
      var aa = data.split(",");
      var data = {};
      aa.forEach(function(option) {
        if (option.indexOf(":") > 0) {
            var value = option.split(":")[0];
            var text = option.split(":")[1];
        } else {
            var value = option;
            var text = option;
        }
        data[value] = text;
      })
    }

    if (typeof data === 'object') {
      var options = [];
      if (data.length) {
        for (var i=0; i<data.length; i++) {
            var value = data[i].value != undefined ? data[i].value : data[i];
            var text = data[i].text != undefined ? data[i].text : data[i];
            var option = $("<option>").text(text).attr("value",value).appendTo( $(this) );

            var edata = data[i].data != undefined ? data[i].data : null;
            if (edata != null) for (var k in edata) {
              option.attr(`data-${k}`, edata[k])
            }

            options.push( option )
        }
      } else {
        for (var value in data)
            options.push( $("<option>").text(data[value]).attr("value",value).appendTo( $(this) ) )
      }

      options.forEach(option => {
        if (setting != undefined) {
            if (setting.disabled) option.disable();
        }
      })
    }

    return this;
}

$$$ = (class $$$ { // 2020
    constructor (setting) {
        this.actions = [];
        this.action = {};
        this.setting = setting;
        
        if (setting != undefined) {
            this.is_debug = setting.debug;
        }
    }

    //------ iframe ------
    set_iframe (e) { return this._register_action({
        type: "set_iframe",
        input: Object.values(arguments),
        do: () => {
            if ( e == null ) {this.iframe = null; return true};
            this.iframe = (typeof e === 'string') ? $(e) : e;
            console.log("iframe", this.iframe);
            return true;
        },
    })}
    no_iframe () { return this._register_action({
        type: "no_iframe",
        input: Object.values(arguments),
        do: () => {
            this.iframe = null;
            return true;
        },
    })}

    //------ iim ------
    iim_load_url (url, timeout=30) { return this._register_action({
        type: "iim_load_url",
        input: Object.values(arguments),
        do: () => {
            IIM.LOAD_URL(url, timeout);
            reload_$();
            
            return true;
        },
    })}
    iim_mouseover (e) { return this._register_action({
        type: "iim_mouseover",
        input: Object.values(arguments),
        do: () => IIM.MOUSEOVER( e, 3 ),
    })}
    iim_fill (e, value) { return this._register_action({
        type: "iim_fill",
        input: Object.values(arguments),
        do: () => IIM.FILL( e, value, 3 ),
    })}
    iim_click (e) { return this._register_action({
        type: "iim_click",
        input: Object.values(arguments),
        do: () => IIM.CLICK( e, 3 ),
    })}
    iim_click_download (e, path, filename) { return this._register_action({
        type: "iim_click_download",
        input: Object.values(arguments),
        do: () => IIM.CLICK_DOWNLOAD( e, path, filename, 3 ),
    })}
    reload_$ () { return this._register_action({
        type: "reload_$",
        input: Object.values(arguments),
        do: () => {return reload_$();},
    })}

    //------ j ------
    jfill (e, value) { return this._register_action({
        type: "jfill",
        input: Object.values(arguments),
        do: () => {
            var ee = this.$(e)
            if (ee.val() == value) return true;
            ee.val( value );
            return true;
        },
    })}
    jclick (e) { return this._register_action({
        type: "jclick",
        input: Object.values(arguments),
        do: () => {
            var ee = this.$(e)
            ee.click();
            return true;
        },
    })}

    //------ e ------
    efill (e, value) { return this._register_action({
        type: "efill",
        input: Object.values(arguments),
        do: () => IIM.EVENT_FILL( e, value ),
    })}
    eclick (e) { return this._register_action({
        type: "eclick",
        input: Object.values(arguments),
        do: () => IIM.EVENT_CLICK( e, 3 ),
    })}
    eclick_download (e, path, filename) { return this._register_action({
        type: "eclick_download",
        input: Object.values(arguments),
        do: () => IIM.EVENT_CLICK_DOWNLOAD( e, path, filename, 3 ),
    })}
    
    //------ try ------
    try (n, f, delay) { return this._register_action({
        type: "try",
        input: Object.values(arguments),
        do: () => {
            for (var i = 1; i <= n; i++) {
                console.group("---- #" + i + " ----");
                var ret = f.apply(this);
                console.groupEnd();
                if (ret !== false) return true;
                if (delay > 0) IIM.DELAY(delay)
            }
            return false;
        },
    })}
    try_fill (n,dd=0, e, value) { return this._register_action({
        type: "try_fill",
        input: Object.values(arguments),
        do: () => {
            return new $$$()
                .try(n, x => { return new $$$()
                    .efill(e, "")
                    .jfill(e, "")
                    .delay(0.1)
                    .efill(e, value)
                    .wait(x => this.$(e).val() == value, 0.1)
                    .go();
                }, dd)
                .go()
        },
    })}
    try_jclick (n,dd=0, e,delay=0, wait = null, timeout = 0.1) { return this._register_action({
        type: "try_click",
        input: Object.values(arguments),
        do: () => {
            return new $$$()
                .try(n, x => {
                    var process = new $$$();
                    process.jclick( e );
                    process.delay( delay );
                    process.reload_$();
                    if (wait !== null) process.wait( wait, timeout );
                    return process.go();
                }, dd)
                .wait( wait, timeout )
                .go()
        },
    })}
    try_click (n,dd=0, e,delay=0, wait = null, timeout = 0.1) { return this._register_action({
        type: "try_click",
        input: Object.values(arguments),
        do: () => {
            return new $$$()
                .try(n, x => {
                    var process = new $$$();
                    process.eclick( e );
                    process.delay( delay );
                    process.reload_$();
                    if (wait != null) process.wait( wait, timeout );
                    return process.go();
                }, dd)
                .wait( wait, timeout )
                .go()
        },
    })}
    try_load_url (n,dd=0, url,delay=0, wait = null,timeout = 0.1) { return this._register_action({
        type: "try_load_url",
        input: Object.values(arguments),
        do: () => {
            return new $$$()
                .try(n, x => {
                    var process = new $$$();
                    process.iim_load_url( url );
                    process.delay( delay );
                    process.reload_$();
                    if (wait != null) process.wait( wait, timeout );
                    process.delay(0.1)
                    return process.go();
                }, dd)
                .wait( wait, timeout )
                .go()
        },
    })}
    
    //------ delay, wait ------
    pause () { return this._register_action({
        type: "pause",
        input: Object.values(arguments),
        do: () => {
            return IIM.PAUSE();
        },
    })}
    delay (delay) { return this._register_action({
        type: "delay",
        input: Object.values(arguments),
        do: () => {
            return IIM.DELAY(delay, null, "Delay: " + delay);
        },
    })}
    wait (something, timeout = 3) { return this._register_action({
        type: "wait",
        input: Object.values(arguments),
        do: () => {
            var ret = null;
            var note = "Wait: " + timeout;
            
            timeout = (timeout >= 0) ? timeout : 0;
            
            
            if (typeof something === 'function') {
                while (timeout >= 0) {
                    this.reload_$();
                    ret = something();      
                    if (ret != null && ret !== false) break;
                    IIM.DELAY( Math.min(1,timeout), null, note);
                    timeout--;
                }
            }
            
            if (typeof something === 'string') {
                while (timeout >= 0) {
                    this.reload_$();
                    ret = $(something).length > 0;
                    if (ret != null && ret !== false) break;
                    IIM.DELAY( Math.min(1,timeout), null, note);
                    timeout--;
                }
            }
            
            return ret != null && ret !== false;
        },
    })}
    wait_gone (something, timeout = 3) { return this._register_action({
        type: "wait_gone",
        input: Object.values(arguments),
        do: (something, timeout = 3) => {
            var ret = null;
            
            timeout = (timeout >= 0) ? timeout : 0;
            
            if (typeof something === 'function') {
                while (timeout >= 0) {
                    ret = something() == false;
                    if (ret) break;
                    IIM.DELAY( Math.min(1,timeout) );
                    timeout--;
                }
            }

            if (typeof something === 'string') {
                while (timeout >= 0) {
                    ret = $(something).length == 0;      
                    if (ret != null && ret !== false) break;
                    IIM.DELAY( Math.min(1,timeout) );
                    timeout--;
                }
            }
            
            return ret !== false;
        },
    })}

    //------ f ------
    f (func) { return this._register_action({
        type: "f",
        input: Object.values(arguments),
        do: () => {
            if (typeof func === 'function') {
                func.apply(this);
            }
            
            return true;
        },
    })}
    
    //------ do ------
    do (action) {
    
        var ret = null;

        if (typeof action == 'object') {
            console.group(action.type, (this.is_debug) ? JSON.stringify(action.input) : "");
            ret = action.do.apply(this, [].concat(action.input));
            action.return = ret;
        }

        if (typeof action == 'string') {
            console.group(action, (this.is_debug) ? JSON.stringify(arguments) : "");
            ret = this.action[action].apply(this, [arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]]);
        }
        
        try {
            if ($) var a = 1;
            console.log("%c-->", "color: dimgray", ret, `(${action.type || action})`);
            console.groupEnd();
        } catch (e) {
            LOAD_CORE();
        }
        
        return ret;
        
    }
    go (setting) {
        var is_ended = false;

        var last_action = this.actions.last();
        if (setting == undefined  ||  setting.skip_last_wait !== true) {
            if (last_action.type.in('wait,wait_gone')) {
                if (this.do(last_action)) is_ended = true;
            }
        }

        if (is_ended) return last_action.return;

        var i = 0;
        while (i<this.actions.length) {
            var action = this.actions[i];

            //----------------------
            this.do(action)
            //----------------------

            if (action.return === false) break;
            if (is_ended) break;
            i++;
        }
        
        if (this.is_debug) console.log("actions", this.actions)

        return action.return;
    }

    //------ $ ------
    $ (e) {
        var ee = e;
        if (typeof e === 'string') ee = $(e);
        if (typeof e === 'object') {
            if (typeof e.e === 'string') {
                if (typeof e.iframe === 'string') ee = $(e.iframe).contents().find(e.e);
                if (typeof e.iframe === 'object') ee = e.iframe.contents().find(e.e);
                if (e.iframe == null) ee = this.$(e.e);
            }
            if (typeof e.e === 'object') {
                if (typeof e.iframe === 'string') ee = $(e.iframe).contents().find(e.e.selector);
                if (typeof e.iframe === 'object') ee = e.iframe.contents().find(e.e.selector);
                if (e.iframe == null) ee = this.$(e.e);
            }
        }
        return ee;
    }

    _register_action (action) {
        this.action[action.type] = this.action[action.type] || action.do;
        this.actions.push( action );
        return this;
    }

})

_ = function(s) {
    console.log(s);
}
$found = function(s) {
    return $(s).length > 0;
}

$$Err = [];
OLD$$ = function(title = "", setting = {}) {

    this.tab = {
        Select: function(i) {
           // window.gBrowser.selectedTab = window.gBrowser.tabContainer.childNodes[i];
            return this.Update();
        },
        First: function() {
            //window.gBrowser.selectedTab = window.gBrowser.tabContainer.childNodes[0];
            return this.Update();
        },
        Last: function() {
            //window.gBrowser.selectedTab = window.gBrowser.tabContainer.childNodes[this.total - 1];
            return this.Update();
        },
        Next: function() {
            var next = (this.current < this.total - 1) ? this.current + 1 : this.total - 1;
            //window.gBrowser.selectedTab = window.gBrowser.tabContainer.childNodes[next];
            return this.Update();
        },
        Prev: function() {
            var next = (this.current > 0) ? this.current - 1 : 0;
            //window.gBrowser.selectedTab = window.gBrowser.tabContainer.childNodes[next];
            return this.Update();
        },
        CloseCurrent: function() {
            //window.gBrowser.removeCurrentTab();
            return this.Update();
        },
        Update: function() {
            //this.total = window.gBrowser.browsers.length;
            //this.current = window.gBrowser.tabContainer.selectedIndex;
            this.url = window.location.href;
            //this.currentTab = window.gBrowser.tabContainer.childNodes[this.current];

            // console.log(this);
            // CORE.Page_init();


            return this;
        }
    }
    this.title = title;
    this.iim_text = [];
    this.err = [];
    this.actions = [];
    this.output = {};

    this.timer = null;

    this.tab.Update();



    this._skip_quick_check = (setting.skip_quick_check !== undefined) ? setting.skip_quick_check : false;
    this._debug = false;
}

OLD$$.prototype.timerDiff = function() {
    if (this.timer == null) return null;
    var end = new Date();
    var diff = (end - this.timer) / 1000;
    return diff;
}

OLD$$.prototype.section = function(section) {
    this.actions.push({
        type: "section",
        section: section,
    });
    return this;
};
OLD$$.prototype.$$ = function(title) {
    this.actions.push({
        type: "$$",
        title: title,
    });
    return this;
};
OLD$$.prototype.____ = function(comment) {
    this.actions.push({
        type: "_",
        comment: comment,
    });
    return this;
};
OLD$$.prototype._ = function(comment, heading) {
    this.actions.push({
        type: "_",
        comment: comment,
        heading: heading,
    });
    return this;
};
OLD$$.prototype.____iim = function(comment) {
    this.actions.push({
        type: "iim",
        comment: comment,
    });
    return this;
};
OLD$$.prototype.iim = function(comment) {
    this.actions.push({
        type: "iim",
        comment: comment,
    });
    return this;
};
OLD$$.prototype.timerReset = function() {
    this.actions.push({
        type: "timerReset",
    });
    return this;
};
OLD$$.prototype.if = function(cond, func, on_fail) {
    this.actions.push({
        type: "if",
        cond: cond,
        func: func,
        on_fail: on_fail,
    });
    return this;
};
OLD$$.prototype.skip_quick_check = function() {
    this.actions.push({
        type: "skip_quick_check",
    });
    return this;
};
OLD$$.prototype.f = function(func, note) {
    this.actions.push({
        type: "f",
        func: func,
        note: note,
    });
    return this;
};
OLD$$.prototype.f1 = function(func) {
    this.actions.push({
        type: "f1",
        func: func,
    });
    return this;
};
OLD$$.prototype.ajaxGet = function(url, callback) {
    this.actions.push({
        type: "ajaxGet",
        url: url,
        callback: callback,
    });
    return this;
};
OLD$$.prototype.ajaxGetJsonP = function(url, callback) {
    this.actions.push({
        type: "ajaxGetJsonP",
        url: url,
        callback: callback,
    });
    return this;
};
OLD$$.prototype.Try = function(n, func, delay = 0) {
    this.actions.push({
        type: "Try",
        n: n,
        func: func,
        delay: delay,
    });
    return this;
};
OLD$$.prototype.Try_jFill = function(n, e, value, clear_exist = true, delay = 0) {
    this.actions.push({
        type: "Try_jFill",
        n: n,
        e: e,
        value: value,
        clear_exist: clear_exist,
        delay: delay,
    });
    return this;
};
OLD$$.prototype.Try_eFill = function(n, e, value, clear_exist = true, delay = 0) {
    this.actions.push({
        type: "Try_eFill",
        n: n,
        e: e,
        value: value,
        clear_exist: clear_exist,
        delay: delay,
    });
    return this;
};
OLD$$.prototype.Try_eChecked = function(n, e, delay = 0) {
    this.actions.push({
        type: "Try_eChecked",
        n: n,
        e: e,
        delay: delay,
    });
    return this;
};
OLD$$.prototype.LoadNewUrl = function(url) {
    this.actions.push({
        type: "LoadNewUrl",
        url: url,
    });
    return this;
};
OLD$$.prototype.LoadUrl = function(url) {
    this.actions.push({
        type: "LoadUrl",
        url: url,
    });
    return this;
};
OLD$$.prototype.TabNew = function(n = 1) {
    this.actions.push({
        type: "TabNew",
        n: n,
    });
    return this;
};
OLD$$.prototype.Tab = function(i) {
    this.actions.push({
        type: "Tab",
        i: i,
    });
    return this;
};
OLD$$.prototype.TabFirst = function() {
    this.actions.push({
        type: "TabFirst",
    });
    return this;
};
OLD$$.prototype.TabLast = function() {
    this.actions.push({
        type: "TabLast",
    });
    return this;
};
OLD$$.prototype.TabNext = function() {
    this.actions.push({
        type: "TabNext",
    });
    return this;
};
OLD$$.prototype.TabPrev = function() {
    this.actions.push({
        type: "TabPrev",
    });
    return this;
};
OLD$$.prototype.TabFind = function(match) {
    this.actions.push({
        type: "TabFind",
        match: match,
    });
    return this;
};
OLD$$.prototype.TabClose = function() {
    this.actions.push({
        type: "TabClose",
    });
    return this;
};
OLD$$.prototype.TabCloseRight = function() {
    this.actions.push({
        type: "TabCloseRight",
    });
    return this;
};
OLD$$.prototype.TabCloseLeft = function() {
    this.actions.push({
        type: "TabCloseLeft",
    });
    return this;
};
OLD$$.prototype.UploadImage = function(url, e) {
    this.actions.push({
        type: "UploadImage",
        url: url,
        e: e,
    });
    return this;
};
OLD$$.prototype.jChecked = function(e) {
    this.actions.push({
        type: "jChecked",
        e: e,
    });
    return this;
};
OLD$$.prototype.jUnChecked = function(e) {
    this.actions.push({
        type: "jUnChecked",
        e: e,
    });
    return this;
};
OLD$$.prototype.jClick = function(e) {
    this.actions.push({
        type: "jClick",
        e: e,
    });
    return this;
};
OLD$$.prototype.jClickIfFound = function(e) {
    this.actions.push({
        type: "jClickIfFound",
        e: e,
    });
    return this;
};
OLD$$.prototype.jClickIf = function(e, cond, ifnot) {
    this.actions.push({
        type: "jClickIf",
        e: e,
        cond: cond,
        ifnot: ifnot,
    });
    return this;
};
OLD$$.prototype.jFillIf = function(e, data, cond, ifnot) {
    this.actions.push({
        type: "jFillIf",
        e: e,
        data: data,
        cond: cond,
        ifnot: ifnot,
    });
    return this;
};
OLD$$.prototype.jClickAway = function(e) {
    this.actions.push({
        type: "jClickAway",
        e: e,
    });
    return this;
}; //--- BETA
OLD$$.prototype.iCode = function(code) {
    this.actions.push({
        type: "iCode",
        code: code,
    });
    return this;
};
OLD$$.prototype.iFill = function(e, value) {
    this.actions.push({
        type: "iFill",
        e: e,
        value: value,
    });
    return this;
};
OLD$$.prototype.jVal = function(e, value) {
    this.actions.push({
        type: "jVal",
        e: e,
        value: value,
    });
    return this;
};
OLD$$.prototype.jFill = function(e, value) {
    this.actions.push({
        type: "jFill",
        e: e,
        value: value,
    });
    return this;
};
OLD$$.prototype.jMouseOver = function(e) {
    this.actions.push({
        type: "jMouseOver",
        e: e,
    });
    return this;
};
OLD$$.prototype.eFill = function(e, value) {
    this.actions.push({
        type: "eFill",
        e: e,
        value: value,
    });
    return this;
};
OLD$$.prototype.eClick = function(e) {
    this.actions.push({
        type: "eClick",
        e: e,
    });
    return this;
};
OLD$$.prototype.formSubmit = function(e) {
    this.actions.push({
        type: "formSubmit",
        e: e,
    });
    return this;
};
OLD$$.prototype.ScrollTo = function(e, timeout = 500, offset = 0) {
    this.actions.push({
        type: "ScrollTo",
        e: e,
        timeout: timeout,
        offset: offset,
    });
    return this;
};
OLD$$.prototype.ReCaptcha2 = function() {
    this.actions.push({
        type: "ReCaptcha2",
    });
    return this;
};
OLD$$.prototype.setIFRAME = function(e) {
    this.actions.push({
        type: "setIFRAME",
        e: e
    });
    return this;
};
OLD$$.prototype.clearIFRAME = function() {
    this.actions.push({
        type: "clearIFRAME",
    });
    return this;
};
OLD$$.prototype.find$ = function(e, callback) {
    this.actions.push({
        type: "find$",
        e: e,
        callback: callback,
    });
    return this;
}; //-- BETA
OLD$$.prototype.delay = function(timeout = 1) {
    this.actions.push({
        type: "delay",
        timeout: timeout,
    });
    return this;
};
OLD$$.prototype.pause = function() {
    this.actions.push({
        type: "pause",
    });
    return this;
};
OLD$$.prototype.wait = function(e, timeout = 3) {
    this.actions.push({
        type: "wait",
        e: e,
        timeout: timeout,
    });
    return this;
};
OLD$$.prototype.waitGone = function(e, timeout = 3) {
    this.actions.push({
        type: "waitGone",
        e: e,
        timeout: timeout,
    });
    return this;
};
OLD$$.prototype.dbResetQueue = function(db) {
    this.actions.push({
        type: "dbResetQueue",
        db: db,
    });
    return this;
};
OLD$$.prototype.dbQueue = function(db, sql) {
    this.actions.push({
        type: "dbQueue",
        db: db,
        sql: sql,
    });
    return this;
};
OLD$$.prototype.dbQueryQueue = function(db) {
    this.actions.push({
        type: "dbQueryQueue",
        db: db,
    });
    return this;
};
OLD$$.prototype.debug = function() {
    this.actions.push({
        type: "debug",
    });

    return this;
};


OLD$$.prototype.go = function() { // Core of processor
    _(".." + this.title + "..", "lightgreen");
    //------------------------------------------------------
    $$Err = [];
    this.iim_text = [];
    this.output = {};
    this.iframe = null;
    this.last_element = null;
    this.last_text = null;
    //------------------------------------------------------
    if (this.actions.last().type == 'wait' && !this._skip_quick_check) {
        var action = $.extend({}, this.actions.last());
        _("-- quick check ...", "lightgray");
        var r = (typeof action.e === 'function') ? action.e() : $found(action.e);
        _(r);
        if (r) return true;
    }
    //------------------------------------------------------
    this.timer = new Date();
    this.section = null;
    //------------------------------------------------------
    var aa = 0;
    while (aa < this.actions.length) {
        // for (var aa = 0; aa < this.actions.length; aa++) {
        var action = $.extend({}, this.actions[aa]);
        var r = false;
        var e = false;

        if (action.e === undefined && this.last_element !== null) action.e = this.last_element;
        if (action.e !== undefined) {

            this.last_element = action.e;

            if (typeof action.e === 'string') {
                e = (this.iframe !== null) ? $iFrame(this.iframe, action.e) : $(action.e);
            } else {
                e = action.e;
            }
            if (this._debug) {
                _("---- action.e ----", "lightgray");
                _(e);
            }
        }

        _("-- action " + action.type + " -- " + ((typeof action.e === 'string') ? action.e : "") + " [" + ((typeof action.value === 'string') ? action.value : "") + "]", "lightgray");
        switch (action.type) {
            case 'section':
                this.section = action.section;
                _("-- section : " + this.section + " --", "lightblue");
                r = 1;
                break;
            case '$$':
                this.title = action.title;
                r = 1;
                break;
            case '_':
                _(action.comment);
                r = 1;
                break;
            case 'iim':
                var comment = action.comment;
                if (action.heading == 'h1') comment = "== ? ==".pr(comment);
                this.iim_text.push(comment);
                var s = [].concat(this.iim_text).reverse();
                iimDisplay(s.join("\n"));
                _(comment);
                r = 1;
                break;
            case 'timerReset':
                this.timer = new Date();
                r = 1;
                break;
            case 'skip_quick_check':
                this._skip_quick_check = true;
                r = 1;
                break;
            case 'if':
                var cond = action.cond;
                if (typeof cond === 'function') cond = cond.apply(this);
                if (cond) {
                    r = (typeof action.func === 'function') ? action.func.apply(this) : 0;
                } else {
                    if (action.on_fail === undefined) action.on_fail = 1;
                    r = (typeof action.on_fail === 'function') ? action.on_fail.apply(this) : action.on_fail;
                }
                break;
            case 'f':
                r = (typeof action.func === 'function') ? action.func.apply(this) : 0;
                break;
            case 'f1':
                if (typeof action.func === 'function') action.func.apply(this);
                r = 1;
                break;
            case 'ajaxGet':
                var ret = $.ajax({
                    url: action.url,
                    type: 'get',
                    cache: false,
                    async: false,
                    beforeSend: function() {},
                    success: function(ret) {},
                    error: function(ret) {}
                }).responseText;

                if (typeof action.callback == 'function') action.callback.apply(this, [ret]);

                r = 1;
                break;
            case 'ajaxGetJsonP':
                var ret = $.ajax({
                    url: action.url,
                    type: 'get',
                    cache: false,
                    async: false,
                    datatype: 'jsonp',
                    success: function(ret) {},
                }).responseText;

                if (typeof action.callback == 'function') action.callback.apply(this, [JSON.parse(ret)]);

                r = 1;
                break;
            case 'Try':
                for (var i = 1; i <= action.n; i++) {
                    // _("---- Try [" + i + "] ----", "lightgrey");
                    r = action.func.apply(this);
                    if (r) break;
                    if (action.delay > 0) IIM_OLD.Wait(action.delay);
                }
                break;
            case 'Try_jFill':
                if (e.length && e.val() === action.value) {
                    r = true;
                    break;
                }

                if (action.clear_exist) e.val("");

                for (var i = 1; i <= action.n; i++) {
                    // _("---- Try jFill [" + i + "] ----", "lightgrey");

                    r = (e !== false) ? e.jFill(action.value) : 0;
                    if (r) break;
                    if (action.delay > 0) IIM_OLD.Wait(action.delay);
                }

                break;
            case 'Try_eFill':
                if (e.length && e.val() === action.value) {
                    r = true;
                    break;
                }

                if (action.clear_exist) e.val("");

                for (var i = 1; i <= action.n; i++) {
                    // _("---- Try eFill [" + i + "] ----", "lightgrey");

                    r = (e !== false) ? e.eFill(action.value) : 0;
                    if (r) break;
                    if (action.delay > 0) IIM_OLD.Wait(action.delay);
                }

                break;
            case 'Try_eChecked':
                if (e.length && e.is(":checked")) {
                    r = true;
                    break;
                }

                for (var i = 1; i <= action.n; i++) {
                    _("---- Try eChecked [" + i + "] ----", "lightgrey");

                    e.eClick();
                    r = (e !== false) ? e.is(":checked") : 0;
                    if (r) break;
                    if (action.delay > 0) IIM_OLD.Wait(action.delay);
                }

                break;
            case 'LoadNewUrl':
                r = IIM_OLD.iLoadNewUrl(action.url);
                break;
            case 'LoadUrl':
                r = IIM_OLD.iLoadUrl(action.url);
                break;

            case 'TabNew':
                iimPlay("CODE:TAB OPEN");
                this.tab.Update();
                this.tab.SelectLast();
                r = true;
                break;
            case 'Tab':
                r = this.tab.Select((action.i >= 0) ? action.i : this.tab.current);
                break;
            case 'TabFirst':
                r = this.tab.First();
                break;
            case 'TabLast':
                r = this.tab.Last();
                break;
            case 'TabNext':
                r = this.tab.Next();
                break;
            case 'TabPrev':
                r = this.tab.Prev();
                break;
            case 'TabFind':
                var found = false;
                if (typeof action.match === 'string') {
                    this.tab.Update();
                    for (var t = 0; t < this.tab.total; t++) {
                        continue;
                        var tab = 1;
                        // var tab = window.gBrowser.tabContainer.childNodes[t];
                        if (tab.hasAttribute('label') && tab.getAttribute('label').has(action.match)) {
                            found = t;
                            break;
                        }
                    }
                }
                if (found !== false) {
                    // window.gBrowser.selectedTab = window.gBrowser.tabContainer.childNodes[found];
                    this.tab.Update();
                }
                r = found !== false;
                break;
            case 'TabClose':
                // r = this.tab.CloseCurrent();
                r = iimPlay("CODE:TAB CLOSE");
                this.tab.Update();
                break;
            case 'TabCloseRight':
                for (var t = this.tab.total - 1; t > this.tab.current; t--) {
                    this.tab.Select(t);
                    this.tab.CloseCurrent();
                }
                r = true;
                break;
            case 'TabCloseLeft':
                for (var t = this.tab.current - 1; t >= 0; t--) {
                    this.tab.Select(t);
                    this.tab.CloseCurrent();
                }
                r = true;
                break;

            case 'UploadImage': //-- BETA
                $("body").find("img._earns").remove();
                var url = action.url.toLowerCase();
                var img = $("<img src='" + action.url + "' class='earns'>").appendTo($("body"));
                var img_file = "__UploadImage";
                if (url.has('png')) img_file += ".png";
                if (url.has('jpg')) img_file += ".jpg";
                if (url.has('jpeg')) img_file += ".jpeg";
                if (url.has('gif')) img_file += ".gif";
                if (url.has('mp4')) img_file += ".mp4";
                var img_dir = (APP.tmpDir) ? APP.tmpDir : AutoIt.iimTmp;
                var img_path = img_dir + img_file;
                _(img_path);

                IIM_OLD.file_delete(img_path);

                img_path = img.SaveTo(img_dir, img_file);

                _("Downloading : ");

                IIM_OLD.Wait(3);

                for (var t = 1; t <= 60; t++) {
                    _(".");
                    if (IIM_OLD.file_exist(img_path)) break;
                    IIM_OLD.Wait(1);
                }

                if (IIM_OLD.file_exist(img_path)) {
                    this.output.img_path = img_path;
                    r = (e !== false) ? e.iFill(img_path) : 0;
                }

                break;

            case 'jChecked':
                r = (e !== false) ? e.prop('checked', true) : 0;
                break;
            case 'jUnChecked':
                r = (e !== false) ? e.prop('checked', false) : 0;
                break;
            case 'jClick':
                r = (e !== false) ? e.jClick() : 0;
                break;
            case 'jClickIfFound':
                if ($found(action.e)) e.jClick();
                r = 1;
                break;
            case 'jClickIf':
                var cond = action.cond;
                if (typeof cond === 'function') cond = cond.apply(this);

                e = $(action.e);

                if (cond) {
                    if (e !== undefined) {
                        e.ScrollTo();
                        e.jClick();
                    }
                } else {
                    if (typeof action.ifnot == 'string') { //-- Goto the section section by action.`ifnot` string
                        // _Var("aa before jClickIf", aa);
                        while (aa < this.actions.length) {
                            aa++;
                            if (this.actions[aa].type == 'section' && this.actions[aa].section == action.ifnot) break;
                        }
                        // _Var("aa after jClickIf", aa);
                    } else if (typeof action.ifnot === 'function') action.ifnot = action.ifnot.apply(this);
                }
                r = 1;
                break;
            case 'jFillIf':
                var cond = action.cond;
                if (typeof cond === 'function') cond = cond.apply(this);

                e = $(action.e);

                if (cond) {
                    if (e !== undefined) {
                        e.ScrollTo();
                        e.jFill(action.data);
                    }
                } else {
                    if (typeof action.ifnot == 'string') { //-- Goto the section section by action.`ifnot` string
                        while (aa < this.actions.length) {
                            aa++;
                            if (this.actions[aa].type == 'section' && this.actions[aa].section == action.ifnot) break;
                        }
                    } else if (typeof action.ifnot === 'function') action.ifnot = action.ifnot.apply(this);
                }
                r = 1;
                break;
            case 'jClickAway':
                r = (e !== false) ? e.jClickAway() : 0;
                break;
            case 'jVal':
                if (e.length && e.val() === action.value) {
                    r = true;
                    break;
                }
                r = (isset(e) && action.value !== undefined) ? e.val(action.value) : 0;
                break;
            case 'jFill':
                if (e.length && e.val() === action.value) {
                    r = true;
                    break;
                }
                r = (e !== false && action.value !== undefined) ? e.jFill(action.value) : 0;
                break;
            case 'jMouseOver':
                r = (e !== false) ? new $$$().iim_mouseover(action.value) : 0;
                // r = (e !== false) ? e.jMouseOver(action.value) : 0;
                break;

            case 'iCode':
                r = iimPlayCode(action.code);
                break;
            case 'iFill':
                if (e.length && e.val() === action.value) {
                    r = true;
                    break;
                }
                r = (e !== false && action.value !== undefined) ? e.iFill(action.value) : 0;
                break; //-- BETA

            case 'eFill':
                if (e.length && e.val() === action.value) {
                    r = true;
                    break;
                }
                r = (e !== false) ? e.eFill(action.value) : 0;
                break;
            case 'eClick':
                // r = (e !== false) ? e.eClick() : 0;
                r = (e !== false) ? new $$$().eclick(e).go() : 0;
                break;
            case 'formSubmit':
                r = (e !== false) ? e.submit() : 0;
                break;
            case 'ScrollTo':
                r = (e !== false) ? e.ScrollTo(action.timeout, action.offset) : 0;
                break;
            case 'ReCaptcha2':
                if (!$found("iframe[src*=recaptcha]")) {
                    r = false;
                    break;
                }

                var iframe = $("iframe[src*=recaptcha]");
                IIM_OLD.Debug().iFrame(iframe).EventClick($("div.recaptcha-checkbox-checkmark:visible"), 60, 5, 1);

                var captcha = new CAPTCHA({
                    'type': 'recaptcha2',
                    'api_2captcha': '6c6d2590322d8c3c9d9aac54aaa088e9',
                });
                captcha.Solve();
                r = captcha._IsSolved();
                break;
            case 'setIFRAME':
                this.iframe = e;
                r = this.iframe !== null && this.iframe.length;
                break;
            case 'clearIFRAME':
                this.iframe = null;
                return true;
                break;
            case 'find$': //-- BETA 

                break;
            case 'delay':
                r = iimPlayCode("WAIT SECONDS=" + action.timeout);
                break;
            case 'pause':
                IIM_OLD.Pause();
                r = true;
                break;
            case 'wait':
                if (this._debug) _(action.e, "red");
                if (typeof action.e === 'function') {
                    while (action.timeout > 0) {
                        r = action.e();
                        if (r) break;

                        iimDisplay("...wait (" + action.timeout + ")..." + "\n" + "-- " + this.title + " --");
                        IIM_OLD.Wait(1);
                        action.timeout--;
                    }
                } else {
                    while (action.timeout > 0) {
                        if (this.iframe !== null && $iFrame(this.iframe, action.e).length) break;
                        if (this.iframe === null && $(action.e).length) break;

                        if (this._debug) _($(action.e));

                        iimDisplay("...wait (" + action.timeout + ")..." + "\n" + "-- " + this.title + " --");
                        IIM_OLD.Wait(1);
                        action.timeout--;
                    }
                    if (this.iframe !== null) r = $iFrame(this.iframe, action.e).length;
                    if (this.iframe === null) r = $(action.e).length;
                }
                break;
            case 'waitGone':
                if (this._debug) _(action.e, "red");
                if (typeof action.e === 'function') {
                    while (action.timeout > 0) {
                        r = !action.e();
                        if (r) break;

                        iimDisplay("...waitGone (" + action.timeout + ")..." + "\n" + "-- " + this.title + " --");
                        IIM_OLD.Wait(1);
                        action.timeout--;
                    }
                } else {
                    while (action.timeout > 0) {
                        if (this.iframe !== null && !$iFrame(this.iframe, action.e).length) break;
                        if (this.iframe === null && !$(action.e).length) break;

                        if (this._debug) _(!$(action.e));

                        iimDisplay("...waitGone (" + action.timeout + ")..." + "\n" + "-- " + this.title + " --");
                        IIM_OLD.Wait(1);
                        action.timeout--;
                    }
                    r = !$found(action.e);
                }
                break;
            case 'dbResetQueue':
                r = 1;
                if (r == 1 && typeof action.db !== 'object') r = 0;

                if (r == 1) action.db.reset_queue();
                break;
            case 'dbQueue':
                r = 1;
                if (r == 1 && typeof action.db !== 'object') r = 0;

                if (r == 1 && typeof action.sql === 'function') action.sql = action.sql.apply(this);
                if (r == 1 && typeof action.sql !== 'string') r = 0;

                if (r == 1) action.db.queue(action.sql);
                break;
            case 'dbQueryQueue':
                r = 1;
                if (r == 1 && typeof action.db !== 'object') r = 0;

                if (r == 1) action.db.query_queue();
                break;
            case 'debug':
                this._debug = true;
                r = 1;
                break;
        } //-- switch --
        //------------------------------------------------------
        if ($ === undefined && CORE2 !== undefined) CORE2.Page_init();
        //------------------------------------------------------
        _("======> " + r + " --", "lightgray");
        if (r && e !== false)
            this.last_element = (this.iframe !== null) ? $iFrame(this.iframe, action.e) : e;

        if (!r) {
            $$Err.push("ERROR : " + this.title + " -> (" + aa + ") type = " + action.type);
            break; //-- for 
        }
        //------------------------------------------------------
        if (action.type != 'debug' && this._debug) this._debug = false;
        //------------------------------------------------------
        aa++;
        //------------------------------------------------------
    } //-- for --
    //------------------------------------------------------
    if ($$Err.length > 0) {
        _("OLD$$.." + this.title + " --> FAIL..", "red");
        _($$Err);
    } else {
        _("OLD$$.." + this.title + " --> SUCCESS..", "green");
    }
    return $$Err.length < 1;
};

//+-----------------------------------------------------------------------------+
//|	IIM																			|
//+-----------------------------------------------------------------------------+
IIM_OLD = {
    debug: false,
    iframe: null,
    iframe_tag: "",

    last_code_tag: "",
    last_xid: null,
    last_comment: null,
    last_selector: null,
    last_saved_file: null,
    last_uploaded_url: null,
    last_element: null,

    fPath: null,
    fName: null,

    comment_: null,

    //++++++++++++++++++++++++++++++++//
    jQueryExtend: {
        jMouseOver: function(tPage, tTag, tWait, callback) {

            return IIM_OLD.jQueryMouseOver($(this), tPage, tTag, tWait, callback);
        },
        jClick: function(tPage, tTag, tWait, callback) {

            return IIM_OLD.jQueryClick($(this), tPage, tTag, tWait, callback);
        },
        jClickAway: function(tPage, tTag, tWait, callback) {

            return IIM_OLD.jQueryClickAway($(this), tPage, tTag, tWait, callback);
        },
        jScrollTo: function(timeout = 500, offset = 0) {

            return IIM_OLD.ScrollTo($(this), timeout, offset);
        },
        jFill: function(value, tPage, tTag, tWait, callback) {

            return IIM_OLD.jQueryFill($(this), value, tPage, tTag, tWait, callback);
        },
        //++++++++++++++++++++++++++++++++//
        //++++++++++++++++++++++++++++++++//
        eMouseOver: function(tPage, tTag, tWait, callback) {

            return IIM_OLD.EventMouseOver($(this), tPage, tTag, tWait, callback);
        },
        eClick: function(tPage, tTag, tWait, callback) {

            return IIM_OLD.EventClick($(this), tPage, tTag, tWait, callback);
        },
        eFill: function(value, tPage, tTag, tWait, callback) {

            return IIM_OLD.EventFill($(this), value, tPage, tTag, tWait, callback);
        },
        //++++++++++++++++++++++++++++++++//
        //++++++++++++++++++++++++++++++++//
        enable: function() {
            $(this).prop('disabled', false);
        },
        disable: function() {
            $(this).prop('disabled', true);
        },
        style: function(style) {
            var ss = ($(this).attr('style') != undefined) ? $(this).attr('style').split(";") : [];
            var ss_new = style.split(";");
            $(this).attr('style', $.extend(ss, ss_new).join(";"));
            return this;
        },
        //++++++++++++++++++++++++++++++++//
        //++++++++++++++++++++++++++++++++//
        iClick: function(tPage, tTag, tWait, callback) {
            var n = rand_string(5);
            $(this).attr('iClick', n);
            return IIM_OLD.TagClick({
                'type': '*',
                'attr': 'iClick:' + n
            }, tPage, tTag, tWait, callback);
        },
        iFill: function(value, tPage, tTag, tWait, callback) {
            var n = rand_string(5);
            $(this).attr('iFill', n);
            return IIM_OLD.Debug().TagFill({
                'type': '*',
                'form': 'ACTION:*',
                'attr': 'iFill:' + n
            }, value, tPage, tTag, tWait, callback);
        },
        //++++++++++++++++++++++++++++++++//
        //++++++++++++++++++++++++++++++++//
        sendkeys: function(x) {
            x = x.replace(/([^{])\n/g, '$1'); // turn line feeds into explicit break insertions, but not if escaped
            return this.each(function() {
                bililiteRange(this).bounds('selection').sendkeys(x).select();
                this.focus();
            });
        }, // sendkeys		//++++++++++++++++++++++++++++++++//
        //++++++++++++++++++++++++++++++++//
        SaveTo: function(fPath, fName = null, tPage, tTag, tWait, callback) {
            // _($(this));
            if (fPath == undefined || fPath == null) fPath = (APP.tmpDir) ? APP.tmpDir : AutoIt.iimTmp;
            IIM_OLD.jQueryDownload($(this), fPath, fName, tPage, tTag, tWait, callback);
            return IIM_OLD.Get_LastSavedFile();
        },
        ScrollTo: function(timeout = 500, offset = 0) {
            IIM_OLD.ScrollTo($(this), timeout, offset);
            return this;
        },
        //++++++++++++++++++++++++++++++++//
        $: function(selector) {
            if (this[0].tagName == 'IFRAME') {
                return this.contents().find(selector);
            } else {
                return $(selector);
            }
        },
        show: function() {
            _($(this));
            return this;
        }
    },
    //++++++++++++++++++++++++++++++++//

    //++++++++++++++++++++++++++++++++//
    file_delete: function(path) {
        var ret = iimPlayCode('FILEDELETE NAME="' + path + '"');
        if (ret == 1) _("WARNING: File '" + path + "' is deleted !", "lightsalmon");
        return ret == 1;
    },
    file_exist: function(path) {
        var ret = iimPlayCode('SET !FOLDER_DATASOURCE "' + path + '"');
        return ret == 1;
    },
    comment: function(input) {
        this.comment_ = (input['comment'] == undefined) ? input : input['comment'];
        return this;
    },
    Wait: function(sec, tPage = null) {
        if (sec <= 0) return;

        var code = "CODE: ";
        code += (tPage != null) ? "SET !TIMEOUT_PAGE " + tPage + jsLF : "";
        code += "WAIT SECONDS=" + sec + jsLF;

        if (this.debug) _(code);

        //****************************
        iimPlay(code);
        //****************************

        this.Debug(false);

        // CORE.Page_init();

        return this;
    },
    Pause: function() {
        var code = "CODE: ";
        code += "PAUSE" + jsLF;
        iimPlay(code);

        CORE.Page_init();
    },
    iLoadUrl: function(url, tPage = 30, tWait = 0.1, callback) {
        var code_tag = "URL GOTO=" + url + jsLF;
        return IIM_OLD._TagPlay({
            code_tag: code_tag,
            tPage: tPage,
            tWait: tWait,
            callback: callback,
        });
    },
    iLoadNewUrl: function(url, tPage = 30, tWait = 0.1, callback) {
        // Only load if new url is set
        if (window.location.href == url) {
            return this;
        }
        return IIM_OLD.iLoadUrl(url, tPage, tWait, callback);
    },
    iLoadBlank: function(tPage = 30, tWait = 0.1, callback) {
        var code = "CODE: \n";
        code += "SET !TIMEOUT_PAGE " + tPage + " \n";
        code += "URL GOTO=http://lib.mixseo.net/blank.php \n";
        code += "WAIT SECONDS=" + tWait + " \n";
        iimPlay(code);

        return this;
    },
    TagWait: function(code_tag, tPage = 30, tTag = 30, tWait = 0.1, callback) {
        //--- Variable --------------------------------------------

        (typeof code_tag == 'string') ? code_tag += " EXTRACT=TXT": code_tag['extract'] = 'TXT';

        return IIM_OLD._TagPlay({
            code_tag: code_tag,
            tPage: tPage,
            tTag: tTag,
            tWait: tWait,
            isTagWait: true,
            callback: callback,
        });
    },
    TagMouseOver: function(code_tag, tPage = 30, tTag = 5, tWait = 0.1, callback) {
        //--- Variable --------------------------------------------

        (typeof code_tag == 'string') ? code_tag += " CONTENT=EVENT:MOUSEOVER": code_tag['content'] = 'EVENT:MOUSEOVER';

        return IIM_OLD._TagPlay({
            code_tag: code_tag,
            tPage: tPage,
            tTag: tTag,
            tWait: tWait,
            callback: callback,
        });
    },
    TagClick: function(code_tag, tPage = 30, tTag = 5, tWait = 0.1, callback) {
        //--- Variable --------------------------------------------

        return IIM_OLD._TagPlay({
            code_tag: code_tag,
            tPage: tPage,
            tTag: tTag,
            tWait: tWait,
            callback: callback,
        });
    },
    TagClickAway: function(code_tag, tPage = 30, tTag = 5, tWait = 0.1, callback) {
        //--- Variable --------------------------------------------

        return IIM_OLD._TagPlay({
            code_tag: code_tag,
            tPage: tPage,
            tTag: tTag,
            tWait: tWait,
            callback: callback,
            click_away: true,
        });
    },
    TagFill: function(code_tag, value, tPage = 30, tTag = 5, tWait = 0.1, callback) {
        //--- Variable --------------------------------------------

        (typeof code_tag == 'string') ? code_tag += ' CONTENT="' + value + '"': code_tag['content'] = value;

        return IIM_OLD._TagPlay({
            code_tag: code_tag,
            tPage: tPage,
            tTag: tTag,
            tWait: tWait,
            callback: callback,
        });
    },
    TagDownload: function(code_tag, fPath, fName, tPage = 30, tTag = 5, tWait = 0.1, callback) {
        //--- Variable --------------------------------------------
        this.fPath = (fPath == null) ? ((APP.tmpDir) ? APP.tmpDir : AutoIt.iimTmp) : fPath;
        this.fName = (fName == null) ? rand_string(10) : fName;
        this.Get_LastSavedFile();
        //--- Variable --------------------------------------------

        var pre_code = 'ONDOWNLOAD FOLDER="' + this.fPath + '" FILE="' + this.fName + '" WAIT=YES' + jsLF;
        (typeof code_tag == 'string') ? code_tag += ' CONTENT=EVENT:SAVETARGETAS': code_tag['content'] = 'EVENT:SAVETARGETAS';

        return IIM_OLD._TagPlay({
            pre_code: pre_code,
            code_tag: code_tag,
            tPage: tPage,
            tTag: tTag,
            tWait: tWait,
            callback: callback,
        });
    },
    TagScreenshot: function(code_tag, fPath, fName, tPage = 30, tTag = 5, tWait = 0.1, callback) {
        //--- Variable --------------------------------------------
        this.fPath = (fPath == null) ? AutoIt.iimTmp : fPath;
        this.fName = (fName == null) ? rand_string(10) : fName;
        this.Get_LastSavedFile();
        //--- Variable --------------------------------------------

        var pre_code = 'ONDOWNLOAD FOLDER="' + this.fPath + '" FILE="' + this.fName + '" WAIT=YES' + jsLF;
        (typeof code_tag == 'string') ? code_tag += ' CONTENT=EVENT:SAVE_ELEMENT_SCREENSHOT': code_tag['content'] = 'EVENT:SAVE_ELEMENT_SCREENSHOT';

        return IIM_OLD._TagPlay({
            pre_code: pre_code,
            code_tag: code_tag,
            tPage: tPage,
            tTag: tTag,
            tWait: tWait,
            callback: callback,
        });
    },

    //++++++++++++++++++++++++++++++++//
    jQueryMouseOver: function(e, tPage = 30, tTag = 5, tWait = 0.1, callback) {
        //--- Variable --------------------------------------------

        var code_tag = {
            type: "*",
            attr: "XID:" + IIM_OLD._XID(e),
        }
        code_tag['content'] = 'EVENT:MOUSEOVER';

        return IIM_OLD._TagPlay({
            e: e,
            code_tag: code_tag,
            tPage: tPage,
            tTag: tTag,
            tWait: tWait,
            callback: callback,
        });
    },
    jQueryClick: function(e, tPage = 30, tTag = 5, tWait = 0.1, callback) {
        //--- Variable --------------------------------------------

        IIM_OLD.jQueryMouseOver(e, 30, 1, 0.1);

        var code_tag = {
            type: "*",
            attr: "XID:" + IIM_OLD._XID(e),
        }

        return IIM_OLD._TagPlay({
            e: e,
            code_tag: code_tag,
            tPage: tPage,
            tTag: tTag,
            tWait: tWait,
            callback: callback,
        });
    },
    jQueryClickAway: function(e, tPage = 30, tTag = 5, tWait = 0.1, callback) {
        //--- Variable --------------------------------------------

        var code_tag = {
            type: "*",
            attr: "XID:" + IIM_OLD._XID(e),
        }

        return IIM_OLD._TagPlay({
            e: e,
            code_tag: code_tag,
            tPage: tPage,
            tTag: tTag,
            tWait: tWait,
            callback: callback,
            click_away: true,
        });
    },
    jQueryFill: function(e, value, tPage = 30, tTag = 5, tWait = 0.1, callback) {
        //--- Variable --------------------------------------------

        var code_tag = {
            type: "*",
            attr: "XID:" + IIM_OLD._XID(e),
        }
        code_tag['content'] = value;

        return IIM_OLD._TagPlay({
            e: e,
            code_tag: code_tag,
            tPage: tPage,
            tTag: tTag,
            tWait: tWait,
            callback: callback,
        });
    },
    jQueryDownload: function(e, fPath, fName, tPage = 30, tTag = 5, tWait = 0.1, callback) {
        //--- Variable --------------------------------------------
        this.fPath = (fPath == null) ? AutoIt.iimTmp : fPath;
        this.fName = (fName == null) ? rand_string(10) : fName;
        this.Get_LastSavedFile();
        //--- Variable --------------------------------------------

        var pre_code = 'ONDOWNLOAD FOLDER="' + this.fPath + '" FILE="' + this.fName + '" WAIT=YES' + jsLF;
        var code_tag = {
            type: "*",
            attr: "XID:" + IIM_OLD._XID(e),
            content: 'EVENT:SAVETARGETAS',
        }

        return IIM_OLD._TagPlay({
            e: e,
            pre_code: pre_code,
            code_tag: code_tag,
            tPage: tPage,
            tTag: tTag,
            tWait: tWait,
            callback: callback,
        });
    },
    jQueryScreenshot: function(e, fPath, fName, tPage = 30, tTag = 5, tWait = 0.1, callback) {
        //--- Variable --------------------------------------------
        this.fPath = (fPath == null) ? AutoIt.iimTmp : fPath;
        this.fName = (fName == null) ? rand_string(10) : fName;
        this.Get_LastSavedFile();
        //--- Variable --------------------------------------------

        var pre_code = 'ONDOWNLOAD FOLDER="' + this.fPath + '" FILE="' + this.fName + '" WAIT=YES' + jsLF;
        var code_tag = {
            type: "*",
            attr: "XID:" + IIM_OLD._XID(e),
        }
        code_tag['content'] = 'EVENT:SAVE_ELEMENT_SCREENSHOT';

        /*
        if ( fPath.indexOf('/') >= 0 && fPath.indexOf('\\') < 0 ) {
        	if ( fPath.substr(-1) == '/' ) {
        		this.last_saved_file = fPath + fName;
        	} else {
        		this.last_saved_file = fPath + "/" + fName;
        	}
        	
        } else {
        	if ( fPath.substr(-1) == '\\' ) {
        		this.last_saved_file = fPath + fName;
        	} else {
        		this.last_saved_file = fPath + "\\" + fName;
        	}
        }
        */

        IIM_OLD.ScrollTo(e, 100);
        IIM_OLD.Wait(0.2);

        return IIM_OLD._TagPlay({
            e: e,
            pre_code: pre_code,
            code_tag: code_tag,
            tPage: tPage,
            tTag: tTag,
            tWait: tWait,
            callback: callback,
        });
    },
    jQueryWait: function(selector, tPage = 30, tTag = 30, tWait = 0.1, callback, iframe = null) {
        //-----------------------------------------------------------
        $("body").attr('jQueryWait-found', '0');
        //-----------------------------------------------------------
        if (typeof selector == 'object') selector = selector.selector;
        //-----------------------------------------------------------
        if ($found(selector, iframe)) return true;
        //-----------------------------------------------------------
        if (this.comment_ != null) {
            iimDisplay("jQueryWait (" + tTag + ") : " + this.comment_);
            this.comment_ = null;
        }
        //-----------------------------------------------------------
        _("jQueryWait : " + selector);
        //-----------------------------------------------------------
        var interval = window.setInterval(function() {
            //--------
            CORE.Page_init();
            //--------
            window.document.getElementsByTagName('body').setAttribute('jQueryWait-FOUND', '0');
            //--------
            // var e = $(selector);
            // _(e);
            //--------
            if ($found(selector, iframe)) {
                window.document.getElementsByTagName('body').setAttribute('jQueryWait-FOUND', '1');
                window.clearInterval(interval);
                return this;
            }
            //--------
            _(".");
            //--------

        }, 500);
        //-----------------------------------------------------------
        IIM_OLD.TagWait({
            'type': 'BODY',
            'attr': 'jQueryWait-FOUND:1'
        }, tPage, tTag, tWait);
        //-----------------------------------------------------------
        window.clearInterval(interval);
        //-----------------------------------------------------------
        return $("body").attr('jQueryWait-FOUND') == 1;
    },
    jWait: function(selector, tTag = 20, callback) {
        //-----------------------------------------------------------
        for (var t = 0; t < 3; t++) {
            if (IIM_OLD.jQueryWait(selector, 30, tTag, 0.1, callback)) break;
        }
        return IIM_OLD.jQueryWait(selector, 30, tTag, 0.1, callback);
    },
    jWaitIframe: function(iframe, selector, tTag = 20, callback) {
        //-----------------------------------------------------------
        for (var t = 0; t < 3; t++) {
            if (IIM_OLD.jQueryWait(selector, 30, tTag, 0.1, callback, iframe)) break;
        }
        return IIM_OLD.jQueryWait(selector, 30, tTag, 0.1, callback, iframe);
    },
    jWaitDisappear: function(selector, tTag = 20, callback) {
        //-----------------------------------------------------------
        return IIM_OLD.jQueryWaitDisappear(selector, 30, tTag, 0.1, callback);
    },
    jQueryWaitDisappear: function(selector, tPage = 30, tTag = 30, tWait = 0.1, callback) {
        //-----------------------------------------------------------
        $("body").attr('jQueryWaitDisappear-found', '0');
        //-----------------------------------------------------------
        if (typeof selector == 'object') selector = selector.selector;
        //-----------------------------------------------------------
        if ($(selector).length < 1) return true;
        //-----------------------------------------------------------
        var interval = window.setInterval(function() {
            _(selector + " : " + $(selector).length);
            if ($(selector).length < 1) {
                $("body").attr('jQueryWaitDisappear-found', '1');
                window.clearInterval(interval);
                return this;
            }
            //--------
            _(".");
        }, 1000);
        //-----------------------------------------------------------
        IIM_OLD.TagWait({
            'type': 'BODY',
            'attr': 'jQueryWaitDisappear-FOUND:1'
        }, tPage, tTag, tWait);
        //-----------------------------------------------------------
        window.clearInterval(interval);
        //-----------------------------------------------------------
        return $("body").attr('jQueryWaitDisappear-FOUND') == 1;
    },
    jQueryWait_is: function(e, find, tPage = 30, tTag = 30, tWait = 0.1, callback) {
        //-----------------------------------------------------------
        var xid = IIM_OLD._XID(e);
        var selector = e.selector + "[xid=" + xid + "]";
        //-----------------------------------------------------------
        var found = function(f, selector) {
                //-------------------------------------------------------
                var ff = false;
                //-------------------------------------------------------
                switch (f) {
                    case ':appear':
                        ff = $(selector).length;
                        break;
                    case ':disappear':
                        ff = $(selector).length < 1;
                        break;
                    default:
                        ff = $(selector).is(f);
                        break;
                }
                //-------------------------------------------------------
                return ff;
            }
            //-----------------------------------------------------------
        if (found(find, selector)) return true;
        //-----------------------------------------------------------
        $("body").attr('jQueryWait_is-found', '0');
        var interval = window.setInterval(function() {
            if (found(find, selector)) {
                $("body").attr('jQueryWait_is-found', '1');
                window.clearInterval(interval);
                return this;
            }
            //--------
            _(".");
        }, 500);
        //-----------------------------------------------------------
        IIM_OLD.TagWait({
            'type': 'BODY',
            'attr': 'jQueryWait_is-FOUND:1'
        }, tPage, tTag, tWait);
        //-----------------------------------------------------------
        window.clearInterval(interval);
        //-----------------------------------------------------------
        return $("body").attr('jQueryWait_is-FOUND') == 1;
    },
    jQueryWait_css: function(e, find, tPage = 30, tTag = 30, tWait = 0.1, callback) {
        //-----------------------------------------------------------
        // ********** This function is not working better with border! Read http\:\/\/api.jquery.com/css/
        // if you want to retrieve the rendered border-width, use: $( elem ).css( "borderTopWidth" ), $( elem ).css( "borderBottomWidth" ), and so on.
        //-----------------------------------------------------------
        var xid = IIM_OLD._XID(e);
        var selector = e.selector + "[xid=" + xid + "]";
        //-----------------------------------------------------------
        var found = function(f, selector) {
                //-------------------------------------------------------
                var ff = true;
                //-------------------------------------------------------
                for (var c in f) {
                    //_( $(selector).css(c) );
                    if (c.toLowerCase().indexOf('color') >= 0) {
                        ff &= colorRGB($(selector).css(c)) == colorRGB(f[c]);
                    } else {
                        ff &= $(selector).css(c) == f[c];
                    }
                }
                //-------------------------------------------------------
                return ff;
            }
            //-----------------------------------------------------------
        if (found(find, selector)) return true;
        //-----------------------------------------------------------
        $("body").attr('jQueryWait_css-found', '0');
        var interval = window.setInterval(function() {
            if (found(find, selector)) {
                $("body").attr('jQueryWait_css-found', '1');
                window.clearInterval(interval);
                return this;
            }
            //--------
            _(".");
        }, 500);
        //-----------------------------------------------------------
        IIM_OLD.TagWait({
            'type': 'BODY',
            'attr': 'jQueryWait_css-FOUND:1'
        }, tPage, tTag, tWait);
        //-----------------------------------------------------------
        window.clearInterval(interval);
        //-----------------------------------------------------------
        return $("body").attr('jQueryWait_is-FOUND') == 1;
    },


    //++++++++++++++++++++++++++++++++//
    EventInsert: function(selector, n = 1, tPage = 30, tTag = 5, tWait = 0.1, callback) {

        return IIM_OLD._EventKeypress(selector, 45, n);
    },
    EventPageUp: function(selector, n = 1, tPage = 30, tTag = 5, tWait = 0.1, callback) {

        return IIM_OLD._EventKeypress(selector, 33, n);
    },
    EventPageDown: function(selector, n = 1, tPage = 30, tTag = 5, tWait = 0.1, callback) {

        return IIM_OLD._EventKeypress(selector, 34, n);
    },
    EventDelete: function(selector, n = 1, tPage = 30, tTag = 5, tWait = 0.1, callback) {

        return IIM_OLD._EventKeypress(selector, 46, n);
    },
    EventHome: function(selector, n = 1, tPage = 30, tTag = 5, tWait = 0.1, callback) {

        return IIM_OLD._EventKeypress(selector, 36, n);
    },
    EventEnd: function(selector, n = 1, tPage = 30, tTag = 5, tWait = 0.1, callback) {

        return IIM_OLD._EventKeypress(selector, 35, n);
    },
    EventSpace: function(selector, n = 1, tPage = 30, tTag = 5, tWait = 0.1, callback) {

        return IIM_OLD._EventKeypress(selector, 32, n);
    },
    EventTab: function(selector, n = 1, tPage = 30, tTag = 5, tWait = 0.1, callback) {

        return IIM_OLD._EventKeypress(selector, 9, n);
    },
    EventESC: function(selector, n = 1, tPage = 30, tTag = 5, tWait = 0.1, callback) {

        return IIM_OLD._EventKeypress(selector, 27, n);
    },
    EventEnter: function(selector, n = 1, tPage = 30, tTag = 5, tWait = 0.1, callback) {

        return IIM_OLD._EventKeypress(selector, 13, n);
    },
    EventBackspace: function(selector, n = 1, tPage = 30, tTag = 5, tWait = 0.1, callback) {

        return IIM_OLD._EventKeypress(selector, 8, n);
    },
    EventArrowRight: function(selector, n = 1, tPage = 30, tTag = 5, tWait = 0.1, callback) {

        return IIM_OLD._EventKeypress(selector, 39, n);
    },
    EventArrowLeft: function(selector, n = 1, tPage = 30, tTag = 5, tWait = 0.1, callback) {

        return IIM_OLD._EventKeypress(selector, 37, n);
    },
    EventArrowUp: function(selector, n = 1, tPage = 30, tTag = 5, tWait = 0.1, callback) {

        return IIM_OLD._EventKeypress(selector, 38, n);
    },
    EventArrowDown: function(selector, n = 1, tPage = 30, tTag = 5, tWait = 0.1, callback) {

        return IIM_OLD._EventKeypress(selector, 40, n);
    },
    EventMouseOver: function(selector, tPage = 30, tTag = 5, tWait = 0.1, callback) {
        //--- Variable --------------------------------------------

        var xid = IIM_OLD._XID(selector);
        if (typeof selector == 'object') {
            selector = "[xid=" + xid + "]";
        }

        var code_tag = 'TAG POS=1 TYPE=* ATTR=XID:{xid} CONTENT=EVENT:MOUSEOVER' + jsLF;
        code_tag = code_tag.replace(/{xid}/g, xid);

        return IIM_OLD._TagPlay({
            e: $(selector),
            code_tag: code_tag,
            tPage: tPage,
            tTag: tTag,
            tWait: tWait,
            callback: callback,
        });
    },
    EventMouseDown: function(selector, tPage = 30, tTag = 5, tWait = 0.1, callback) {
        //--- Variable --------------------------------------------

        if (typeof selector == 'object') {
            selector = "[xid=" + IIM_OLD._XID(selector) + "]";
        }

        var code_tag = 'EVENT TYPE=MOUSEDOWN SELECTOR="{selector}" BUTTON=0' + jsLF;
        code_tag = code_tag.replace(/{selector}/g, selector);

        return IIM_OLD._TagPlay({
            e: $(selector),
            code_tag: code_tag,
            tPage: tPage,
            tTag: tTag,
            tWait: tWait,
            callback: callback,
        });
    },
    EventClick: function(selector, tPage = 30, tTag = 5, tWait = 0.1, callback) {
        //--- Variable --------------------------------------------

        if (typeof selector == 'object') {
            selector = "[xid=" + IIM_OLD._XID(selector) + "]";
        }

        var code_tag = 'EVENT TYPE=CLICK SELECTOR="{selector}" BUTTON=0' + jsLF;
        code_tag = code_tag.replace(/{selector}/g, selector);

        return IIM_OLD._TagPlay({
            e: $(selector),
            code_tag: code_tag,
            tPage: tPage,
            tTag: tTag,
            tWait: tWait,
            callback: callback,
        });
    },
    EventFill: function(selector, value, tPage = 30, tTag = 5, tWait = 0.1, callback) {
        //--- Variable --------------------------------------------

        if (typeof selector == 'object') {
            selector = "[xid=" + IIM_OLD._XID(selector) + "]";
        }

        var code_tag = 'EVENTS TYPE=KEYPRESS SELECTOR="{selector}" CHARS="{value}"' + jsLF;
        code_tag = code_tag.replace(/{selector}/g, selector);
        code_tag = code_tag.replace(/{value}/g, AddSlashes(value));

        return IIM_OLD._TagPlay({
            e: $(selector),
            code_tag: code_tag,
            tPage: tPage,
            tTag: tTag,
            tWait: tWait,
            callback: callback,
        });
    },
    EventSelectByText: function(selector, value, tPage = 30, tTag = 5, tWait = 0.1, callback) {

        return IIM_OLD.EventClick(selector.find('option').filter(function() {
            return $.trim($(this).text()) == value;
        }), tPage, tTag, tWait, callback);
    },
    EventKeypress___: function(selector, value, modifier = null, tPage = 30, tTag = 5, tWait = 0.1, callback) {
        //--- NOT WORKING --------------------------------------------
        //--- Variable --------------------------------------------

        if (typeof value == 'string') {
            var code_tag = 'EVENT TYPE=KEYPRESS SELECTOR="{selector}" KEY="{value}"';
        } else {
            var code_tag = 'EVENT TYPE=KEYPRESS SELECTOR="{selector}" CHAR="{value}"';
        }
        if (modifier != null) {
            code_tag += ' MODIFIERS="{modifier}"';
        }
        code_tag = code_tag.replace(/{selector}/g, selector);
        code_tag = code_tag.replace(/{value}/g, value);
        code_tag = code_tag.replace("{modifier}", modifier);

        code_tag += jsLF;

        return IIM_OLD._TagPlay({
            code_tag: code_tag,
            tPage: tPage,
            tTag: tTag,
            tWait: tWait,
            callback: callback,
        });
    }, //--- Not working yet


    //++++++++++++++++++++++++++++++++//
    ScrollTo: function(e, timeout = 500, offset = 0) {
        $('html, body').animate({
            scrollTop: (e.offset() == undefined) ? $("body").height() : (e.offset().top + offset)
        }, timeout);
        return this;
    },
    DownloadFile: function(input, tPage = 30, tTag = 5, tWait = 0.1, callback) {
        if (!$("body").length) return Err("No body element found !");
        //---------------------------------------------------------
        if (input['url'] == null) return Err("No url found !");
        if (input['fName'] == null) return Err("No fName found !");
        //---------------------------------------------------------
        if (input['fPath'] == null) input['fPath'] = (APP.tmpDir) ? APP.tmpDir : AutoIt.iimTmp;
        //---------------------------------------------------------
        var ext = input['fName'].split(".").last();
        var xid = "IIM_DownloadFile_" + Rand();
        //---------------------------------------------------------
        this.last_saved_file = null;
        //---------------------------------------------------------
        switch (ext) {
            case 'mp4xxxx':
                {
                    var oo = $("[xid=" + xid + "]");
                    if (!oo.length) {
                        oo = $("<video>", {
                            'xid': xid
                        });
                        $("body").append(oo);
                    }
                    oo.attr('src', input['url']);
                    break;
                }
            default:
                {
                    var oo = $("img[xid=" + xid + "]");
                    if (!oo.length) {
                        oo = $("<img>", {
                            'xid': xid
                        });
                        $("body").append(oo);
                    }
                    oo.attr('src', input['url']);
                }
        }
        //---------------------------------------------------------
        this.Debug().TagDownload({
            'type': '*',
            'attr': 'XID:' + xid
        }, input['fPath'], input['fName']);
        // this.Debug().jQueryDownload( oo, input['fPath'], input['fName'], tPage, tTag, tWait, callback );
        //_( "last_saved_file : " + this.last_saved_file);

        //---------------------------------------------------------
        return this;
    },
    PrntSc_Upload: function(input, callback) {
        //---------------------------------------------------------
        var image_url = null;
        //---------------------------------------------------------
        if (input['local_image'] == null) return Err("No local image found !");
        //---------------------------------------------------------
        if (input['get_image_url'] == null) input['get_image_url'] = true;
        //---------------------------------------------------------
        FF.Save1().Add_Tab(true).Url("https\:\/\/prnt.sc\/");
        //---------------------------------------------------------
        if (IIM_OLD.TagWait({
                'type': 'DIV',
                'attr': 'TXT:Browse<SP>images'
            }, 60, 5, 1)) {
            IIM_OLD.jQueryFill($("input[type=file]:eq(0)"), input['local_image'], 60, 5, 1);

            if (IIM_OLD.TagWait({
                    'type': 'DIV',
                    'attr': 'CLASS:*uploader-result*&&TXT:*Success!*&&STYLE:*block*'
                }, 60, 120, 1)) {
                var uploaded_url = $("a#link-textbox").text();

                if (input['get_image_url']) {
                    // Get image url;
                    IIM_OLD.iLoadUrl(uploaded_url, 10, 1);
                    // if ( IIM_OLD.TagWait({'type':'IMG','attr':'ID:screenshot-image'}, 60,120,1) ) {
                    if (IIM_OLD.jQueryWait($("img#screenshot-image"), 60, 120, 1)) {
                        image_url = $("#screenshot-image").attr('src');
                    } else {
                        return Err("Can not get uploaded_url !");
                    }
                } else {
                    image_url = uploaded_url;
                }
            } else {
                return Err("Can not upload ! Some error from prnt.sc !");
            }
        }
        //---------------------------------------------------------
        this.last_uploaded_url = image_url;
        //---------------------------------------------------------
        FF.Close_Tab().Return1();
        //---------------------------------------------------------
        return image_url;
    },

    //++++++++++++++++++++++++++++++++//
    Get_LastSavedFile: function() {
        if (this.fPath.indexOf('/') >= 0 && this.fPath.indexOf('\\') < 0) {
            if (this.fPath.substr(-1) == '/') {
                this.last_saved_file = this.fPath + this.fName;
            } else {
                this.last_saved_file = this.fPath + "/" + this.fName;
            }

        } else {
            if (this.fPath.substr(-1) == '\\') {
                this.last_saved_file = this.fPath + this.fName;
            } else {
                this.last_saved_file = this.fPath + "\\" + this.fName;
            }
        }
        return this.last_saved_file;
    },

    //++++++++++++++++++++++++++++++++//
    iFrame: function(iframe) {
        this.iframe = iframe;

        if (iframe == null) {
            this.iframe_tag = "";
        } else {
            var iframe_name = "iframe_" + rand_string();
            if (iframe != null && iframe != undefined && iframe.html() != undefined && iframe.attr('name') != undefined && iframe.attr('name').length > 0) {
                iframe_name = iframe.attr('name');
            }
            iframe.attr('name', iframe_name);

            this.iframe_tag = "FRAME NAME=" + iframe_name + jsLF;
        }

        return this;
    },
    Debug: function(on = true) {
        this.debug = on;
        return this;
    },
    Selector: function(s) {
        if (s == null) return this.last_selector;

        if (typeof s == 'object') {
            s = "[xid=" + IIM_OLD._XID(s) + "]";
        }

        this.last_selector = s;

        return this;
    },

    //++++++++++++++++++++++++++++++++//
    _EventKeypress: function(selector, key, n = 1, tPage = 30, tTag = 5, tWait = 0.1, callback) {
        //--- Variable --------------------------------------------
        if (typeof selector == 'object') {
            selector = "[xid=" + IIM_OLD._XID(selector) + "]";
        }

        var code_tag = '';
        for (var i = 0; i < n; i++) {
            code_tag += 'EVENT TYPE=KEYPRESS SELECTOR="{selector}" KEY={key}' + jsLF;
        }

        code_tag = code_tag.replace(/{selector}/g, selector);
        code_tag = code_tag.replace(/{key}/g, key);

        return IIM_OLD._TagPlay({
            code_tag: code_tag,
            tPage: tPage,
            tTag: tTag,
            tWait: tWait,
            callback: callback,
        });
    },
    _TagPlay: function(input) {
        try {
            input.callback ? input.callback : callback = function() {};

            this.last_code_tag = input.code_tag;
            if (this.debug) _("this.last_code_tag : " + this.last_code_tag);

            input.code_tag = IIM_OLD._TagFormat(input.code_tag);

            this.last_element = input.e;

            var code = IIM_OLD._Head();
            code += (input.tPage > 0) ? "SET !TIMEOUT_PAGE " + input.tPage + jsLF : "";
            code += (input.tTag > 0) ? "SET !TIMEOUT_TAG " + input.tTag + jsLF : "";
            code += this.iframe_tag;
            if (input.pre_code != undefined) {
                code += "'----Pre----" + jsLF;
                code += input.pre_code + jsLF;
            }
            code += "'----Code----" + jsLF;
            code += input.code_tag + jsLF;

            if (!input.click_away) {
                code += "'----NO Click Away----" + jsLF;
                code += "TAB T=1" + jsLF;
            }

            if (this.debug) _(input.e);
            if (this.debug) _(code);


            //****************************
            iimPlay(code);
            //****************************
            if (this.last_comment != null) this._(this.last_comment + " END !");

            CORE.Page_init();
            this.iFrame(null);
            this._(null);
            this.Debug(false);

            if (input['isTagWait']) {
                if (iimGetLastExtract(0) != "#EANF#") {
                    if (input.tWait > 0) {

                        IIM_OLD.Wait(input.tWait);
                    }
                    if (typeof input.callback == 'function') {

                        input.callback();
                    }
                    return true;
                } else {
                    return false;
                }
            } else {

                if (input.tWait > 0) {

                    IIM_OLD.Wait(input.tWait);
                }

                if (typeof input.callback == 'function') {

                    input.callback();
                }
            }

            return this;
        } catch (e) {
            this._(this.last_comment + " FAIL !");

            this._(null);
            this.Debug(false);
            return this;
        }
    },
    _TagFormat: function(code_tag) {
        if (code_tag == null || code_tag == undefined) {
            if (this.last_code_tag != null) {
                return this.last_code_tag;
            }
        }
        if (typeof code_tag == 'string') {
            return code_tag;
        }
        if (typeof code_tag == 'object') {
            //_( code_tag );

            // Convert Ojbect to Array
            var arr = Object_To_Array(code_tag);
            arr.unshift({
                pos: 1
            });
            code_tag = Array_To_Object(arr);
            //_( code_tag );

            var tag = [];
            for (var key in code_tag) {

                var value = code_tag[key].toString();
                if (value != undefined) {
                    value = value.replace(/\s/ig, '<SP>');
                    value = value.replace(/\n/ig, '<BR>');
                }

                key = key.toUpperCase();

                tag.push(key + "=" + value);

            }

            code_tag = "TAG " + tag.join(" ");

            return code_tag;
        }
    },
    _Head0: function() {
        var codehead = "";
        codehead = "CODE: ";
        return codehead;
    },
    _Head: function() {
        var codehead = IIM_OLD._Head0();
        codehead += "ONDIALOG POS=1 BUTTON=OK CONTENT=" + jsLF;
        //codehead += (PROXY.ADDRESS.length > 0) ? "PROXY ADDRESS="+PROXY.ADDRESS + jsLF : "";
        codehead += "SET !ENCRYPTION NO" + jsLF;
        //codehead += (PROXY.USER.length > 0  &&  PROXY.PASS.length > 0) ? "ONLOGIN USER="+PROXY.USER+" PASSWORD="+PROXY.PASS+"" + jsLF : "";
        //codehead += (USERAGENT != null && USERAGENT.length > 0) ? "SET !USERAGENT "+iimData(USERAGENT) + jsLF : "";
        codehead += "SET !REPLAYSPEED FAST" + jsLF;
        codehead += "SET !ERRORIGNORE YES" + jsLF;
        codehead += "SET !EXTRACT_TEST_POPUP NO" + jsLF;
        //codehead += "SET !TIMEOUT_TAG 1" + jsLF;
        codehead += "SET !TIMEOUT_STEP 1" + jsLF;
        codehead += "SET !TIMEOUT_PAGE 10" + jsLF;

        return codehead;
    },
    _XID: function(e) {
        var xid = rand_string(32);

        this.last_xid = xid;

        if (this.iframe != null) {
            if (typeof e == 'object') {
                e = $iFrame(this.iframe, e.selector);
            } else if (typeof e == 'string') {
                e = $iFrame(this.iframe, e);
            }
        }
        e.attr('xid', xid);
        return xid;
    },
    _: function(s, color = null) {
        this.last_comment = s;
        if (s != null) _(s, color);
        return this;
    },
}
Helper = (class Helper {
	static safe (s, _default = null, params) {
		try {
			for (var field in params) {
				eval("var " + field + " = params[field];");
			}
			eval("var ret = " + s);

			if (ret === undefined) ret = _default;

			return ret;
		} catch (e) {
			return _default;
		}
	}

    static safe_load_url(url, wait, timeout) {
    	return new $$()
            .LoadUrl(url)
            .wait(wait, timeout)
            .go();
    }

    static safe_select_by_text (e, text) {
        var value = $(e).find('option').filter(function () { return $(this).html() == text; }).val()

        if (value == undefined) return false;

    	return new $$()
            .eClick( $(e) )
            .eClick( $(e).find(`option[value='${value}']`) )
            .wait(x => $(e).val() == value)
            .go();
    }
    static safe_select2_by_text (e, text) {
        var value = $(e).find('option').filter(function () { return $(this).html() == text; }).val()

        if (value == undefined) return false;

    	return new $$()
            .eClick( $(e) )
            .eClick( `option[value='${value}']` )
            .wait(function() {
                return $(e).val() == value;
            })
            .go();
    }

    static safe_select2_in_text (e, text) {
        var value = $(e).find('option').filter(function () { return $(this).html().indexOf(text) >= 0; }).val()

        if (value == undefined) return false;

    	return new $$()
            .eClick( $(e) )
            .eClick( `option[value='${value}']` )
            .wait(function() {
                return $(e).val() == value;
            })
            .go();
    }

    static safe_select (e, value) {
    	return new $$()
            .f(function() {
                $(e).val(value);
            })
            .wait(function() {
                return $(e).val() == value;
            })
            .go();
    }
    static safe_select2 (e, value) {
    	return new $$()
            .eClick( $(e) )
            .eClick( `option[value='${value}']` )
            .wait(function() {
                return $(e).val() == value;
            })
            .go();
    }
    static safe_fill (e, value, wait) {
        var process = new $$().debug()
            .jFill(e, "")
            .eFill(e, value)
            .wait(function() {
                return $(e).val() == value
            })

        if (wait != undefined)
            process.wait( wait )

        return process.go();
    }
    static safe_jfill (e, value, wait) {
        var process = new $$().debug()
            .eClick(e)
            .jFill(e, value)
            .wait(function() {
                return $(e).val() == value
            })

        if (wait != undefined)
            process.wait( wait )

        return process.go();
    }
    static safe_click (e, wait, timeout=3) {
        return new $$()
            .eClick(e)
            .wait(wait, timeout)
            .go();
    }
    static safe_checkbox (e) {
        return new $$()
            .eClick(e)
            .wait(function() {
                return $(e).is(":checked")
            })
            .go();
    }
    static safe_uncheckbox (e) {
        return new $$()
            .eClick(e)
            .wait(function() {
                return !$(e).is(":checked")
            })
            .go();
    }

    static reload_$ () {
        _LOAD_CORE(function() {}); return 1;
    }

    static get_fake_profile () {
        try {
            // app.try_load_url_ajax("https://fakenametool.net/generator/random/vi_VN/vietnam");
            app.try_load_url_ajax("https://fakenametool.org/fake-name-generator/vi_VN");

            // _(app.$("body").html())
            _(app.$("div.card-body:has(h5:contains('Fake Company')) span.can-copy:eq(0)"))

            var profile = {}

            // console.log("profile 1", profile);

            if ( app.$("div.card-body:has(h5:contains('Fake Company'))").length ) {
                profile.business = app.$("div.card-body:has(h5:contains('Fake Company')) span.can-copy:eq(0)").text().replace(/\-/ig, ' ').trim();
                // console.log("profile 2", profile);
                // profile.email = app.$("div.card-body:has(h5:contains('Fake Company')) span.can-copy:eq(1)").text().trim().toLowerCase();
                profile.full_name = app.$("span.id_name").text().trim();
                profile.username = app.$("div.card-body:has(h5:contains('Internet Details')) span.can-copy:eq(0)").text().trim().replace(/\-\.\s/ig, '');
                profile.address = app.$("div.card-body address.can-copy").text().trim().split("\n")[0].trim();
                profile.city = app.$("div.card-body address.can-copy").text().trim().split("\n")[1].trim();

            }

            if ( app.$("div.card-body tr:has(td:contains('Fake Company'))").length ) {
                profile.business = app.$("div.card-body tr:has(td:contains('Fake Company')) td:eq(1)").text().replace(/\-/ig, ' ').trim();
                profile.full_name = app.$("div.card-body tr:has(td:contains('Fake Name')) td:eq(1)").text().trim();
                profile.username = app.$("div.card-body tr:has(td:contains('Username')) td:eq(1)").text().trim().replace(/\-\.\s/ig, '');
                profile.address = app.$("div.card-body tr:has(td:contains('Address:')) td:eq(1)").text().trim();
                profile.city = "Hanoi,Da Nang,HCM City".split(",").rand().trim();
                // console.log("profile 2", profile);
            }

            profile.province = profile.city;
            profile.zip = "10000,70000".split(",").rand().trim();
            profile.phone = "09" + RAND.Number(8);

            profile.email = profile.username + RAND.Number(2) + "@" + "gmail.com,hotmail.com,vnn.vn,aol.com,yahoo.com,outlook.com".split(",").rand();

            // console.log("profile 3", profile);

            // _Var("app.body-content", app.$("div.body-content").html());

            return profile;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
    static get_fake_profile_OLD () {
        try {
            // app.try_load_url_ajax("https://fakenametool.net/generator/random/vi_VN/vietnam");
            app.try_load_url_ajax("https://api.proxycrawl.com/?token=UVybvhBbViLv5yYhpeiavQ&url=https://fakenametool.net/generator/random/vi_VN/vietnam");

            _(app.$("div.body-content p:has(span.dul:contains('Company'))"))

            var profile = {}
            profile.business = app.$("div.body-content p:has(span.dul:contains('Company'))").text().remove("Company: ").replace(/\-/ig, ' ').trim();
            profile.email = app.$("div.body-content p:has(span.dul:contains('Username'))").text().remove("Username: ").trim().toLowerCase().split(" ")[0].trim();
            profile.full_name = app.$("div.body-content h3 b").text().split(".").last().trim();
            profile.address = app.$("div.body-content p.lead").eq(0).text().split(",")[0].trim();
            profile.city = "Hanoi,Da Nang,HCM City".split(",").rand().trim();
            profile.province = profile.city;
            profile.zip = "10000,70000".split(",").rand().trim();
            profile.phone = "09" + RAND.Number(8);

            profile.address = profile.address
                .remove("ÄÃ  Náºµng")
                .remove("HÃ  Ná»™i")
                .remove("Há»“ ChÃ­ Minh")

            profile.email += RAND.Number(2) + "@" + "gmail.com,hotmail.com,vnn.vn,aol.com,yahoo.com,outlook.com".split(",").rand();

            // console.log("fake_profile", fake_profile);

            // _Var("app.body-content", app.$("div.body-content").html());

            return profile;
        } catch (e) {
            return null;
        }
    }
})
//+-----------------------------------------------------------------------------+
//| DB3                                                                         |
//+-----------------------------------------------------------------------------+
DB3 = function(input) {
    //-----------------------------------------------------------
    this.is_debug = 1;
    this.sqls = [];
    this.ret = {
        rows: [],
        rowsBy: {},
    };
    //-----------------------------------------------------------
    this.url = (input['url'] != undefined) ? input['url'] : null;
    //-----------------------------------------------------------
    this.setting = $.extend({
        dbname: null,
        user: null,
        pass: null,
        server: 'localhost'
    }, input);
    //-----------------------------------------------------------
}
DB3.prototype.reset_queue = function() {
    this.sqls = [];
    return this;
}
DB3.prototype.queue = function(new_sql) {
    if (new_sql == null || new_sql == undefined) return this;
    this.sqls.push(new_sql);
    return this;
}
DB3.prototype.query_queue = function() {
    if (this.sqls.length < 1) return;
    this.Query(this.sqls.join(";"));
    _(`DB3.query_queue processed (${this.sqls.length} queries) !`, "lightblue");
    return this;
}
DB3.prototype.Query = function(input) {
    var self = this;
    //-----------------------------------------------------------
    if (input == null) return this;
    //-----------------------------------------------------------
    this.sql = null;
    if (typeof input === 'string') this.sql = input;
    if (is_array(input) && input.length > 0) this.sql = input.join(";");
    if (isset(input.sql)) this.sql = (input['sql'] != undefined) ? input['sql'] : null;
    if (this.sql == null) return null;
    this.last_sql = this.sql;
    //-----------------------------------------------------------
    var ret = this._jSQL(this.sql);
    this.ret = ret;
    //-----------------------------------------------------------
    // _(ret);
    //-----------------------------------------------------------
    if (isset(input.id) && ret.found) { // SELECT 

        this.ret.fields = Object.keys(ret.rows[0]);

        //--- append other functions if exists in `input`
        for (var f in input) {
            if (typeof input[f] !== 'function') continue;
            if (f.in("UpdateSQL,Update")) continue;
            ret.rows.forEach(function(row) {
                row[f] = input[f];
            });
        }


        //--- Append .UpdateSQL & .Update function
        ret.rows.forEach(function(row) {
            row._db = {
                'table': input.table,
                'id': input.id,
            };

            row.UpdateSQL = function(set) {
                return "UPDATE `" + input.table + "` SET " + self.SqlSet(set) + " WHERE `" + input.id + "`='" + this[input.id] + "' LIMIT 1 ";
            }
            row.Update = function(set) {
                _(this.UpdateSQL(set), "lightgray");
                if (self.Query(this.UpdateSQL(set)).ret.success) {
                    $.extend(this, set);
                    _("--- row.Update (#" + this[input.id] + ") : " + JSON.stringify(set) + " ", "lightgrey");
                } else {
                    _("--- ERR: Row.Update", "red");
                    _(self.ret);
                }
                return this;
            }
        });


        //--- rowsBy
        // this._rowsBy(this.ret.fields, ret.rows);


        //--- Save to this.rows
        this.rows = ret.rows;
    } //--- SELECT 
    //-----------------------------------------------------------
    return this;
}
DB3.prototype.firstRow = function() {

    return (this.ret.found) ? this.ret.rows[0] : null;
}
DB3.prototype.showReturn = function(s = 1) {
    if (s == 0) return this;
    _(this.sql, 'lightgray');
    _(this.ret);
    return this;
}
DB3.prototype.jsonFields = function(fields) {
    if (this.rows === undefined || this.rows.length < 1) return this;
    if (fields === null) return this;

    var rows = this.rows;
    var tFields = [fields];
    if (typeof fields === 'string' && fields.indexOf(',') > 0) tFields = fields.split(",");
    if (is_array(fields)) tFields = fields;

    tFields.forEach(function(field) {
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row[field] === undefined) row[field] = {};
            if (row[field] === null) row[field] = {};
            if (typeof row[field] === 'object') continue;
            if (typeof row[field] === 'string') eval("row['" + field + "'] = " + row[field]);
        }
    });

    return this;
}
DB3.prototype.formatRows = function(f) {
    if (this.rows === undefined || this.rows.length < 1) return this;
    if (typeof f !== 'function') return this;

    for (var i = 0; i < this.rows.length; i++) f(this.rows[i]);

    this._rowsBy(this.ret.fields, this.rows);

    return this;
}
DB3.prototype._rowsBy = function(fields, rows) {
    var rowsBy = {};
    fields.forEach(function(field) {
        if (rowsBy[field] === undefined) rowsBy[field] = {};
    });
    fields.forEach(function(field) {
        rows.forEach(function(row, i) {
            if (rowsBy[field][row[field]] === undefined) rowsBy[field][row[field]] = $.extend({
                _n_: -1
            }, row);

            rowsBy[field][row[field]]._n_++;
            var n = rowsBy[field][row[field]]._n_;

            rowsBy[field][row[field]][n] = row;
        });
    })
    this.ret.rowsBy = rowsBy;
    return this;
}
DB3.prototype._jSQL = function(sql) {
    //-----------------------------------------------------------
    var url = this.url + '?';
    url += 'd=' + encodeURIComponent(this.setting['dbname']) + '&';
    url += 'u=' + encodeURIComponent(this.setting['user']) + '&';
    url += 'p=' + encodeURIComponent(this.setting['pass']) + '&';
    url += 's=' + encodeURIComponent(this.setting['server']) + '&';
    url += '_=' + RAND.Between(10000, 99999);

    try {
        var j = $.ajax({
            url: url,
            type: 'post',
            cache: false,
            async: false,
            data: {
                sql: encodeURIComponent(sql),
            },
            dataType: 'json',
            beforeSend: function() {},
            success: function(ret) {},
            error: function(ret) {},
            timeout: 2000,
        }).responseJSON;

        j['success'] = j != undefined && j.status;
        j['found'] = j['success'] && j.rows !== undefined && j.rows.length > 0;

        return j;
    } catch (e) {
        return e;
    }
}
DB3.prototype.SqlSet = function(input, delimiter = ',', prefix = null) {
    var ss = [];
    //-----------------------------------------------------------
    prefix = (prefix == null) ? "" : "`" + prefix + "`.";
    //-----------------------------------------------------------
    delimiter = delimiter.toUpperCase();
    //-----------------------------------------------------------
    $.each(input, function(f, value) {
        // _("field: " + f + " | value:" + value);

        if (typeof value === 'function') value = value();
        if (typeof value === 'array') value = "<IN> ('" + value.join("','") + "')";

        if (value == null) {
            if (['AND', 'OR'].has(delimiter)) ss.push(prefix + "`" + f + "` IS NULL");
            if (!['AND', 'OR'].has(delimiter)) ss.push(prefix + "`" + f + "`=NULL");
            return;
        }

        //-----------------------------------------------------------
        var uValue = value.toString().trim().toUpperCase();
        //-----------------------------------------------------------

        if (uValue.indexOf('!=') == 0 || uValue.indexOf('<>') == 0) {
            ss.push(prefix + "`" + f + "` " + value + "");
            return;
        }
        if (uValue.indexOf('<+>') == 0) {
            var xvalue = value.replace('<+>', '').trim();
            ss.push(prefix + "`" + f + "` = IFNULL(`" + f + "` + " + xvalue + ", " + xvalue + ")");
            return;
        }
        if (uValue.indexOf('<DATE_ADD>') == 0) {
            var interval = value.replace('<DATE_ADD>', '').trim();
            ss.push(prefix + "`" + f + "` = DATE_ADD(`" + f + "`, INTERVAL " + interval + ")");
            return;
        }
        if (uValue.indexOf('<NOW_ADD>') == 0) {
            var interval = value.replace('<NOW_ADD>', '').trim();
            ss.push(prefix + "`" + f + "` = DATE_ADD(NOW(), INTERVAL " + interval + ")");
            return;
        }
        if (uValue.indexOf('<->') == 0) {
            var xvalue = value.replace('<->', '').trim();
            ss.push(prefix + "`" + f + "` = IF(`" + f + "` IS NULL, " + xvalue + ", `" + f + "` - " + xvalue + ")");
            return;
        }
        if (uValue.indexOf('<LIKE>') == 0) {
            ss.push(prefix + "`" + f + "` " + value.replace('<LIKE>', 'LIKE ') + "");
            return;
        }
        if (uValue.indexOf('<IN>') == 0) {
            ss.push(prefix + "`" + f + "` " + value.replace('<IN>', 'IN ') + "");
            return;
        }
        if (uValue.indexOf('<IS>') == 0) {
            ss.push(prefix + "`" + f + "` " + value.replace('<IS>', 'IS ') + "");
            return;
        }
        if (uValue.indexOf('NOW()') == 0) {
            ss.push(prefix + "`" + f + "` = NOW() ");
            return;
        }
        if (uValue.indexOf('<FUNC>') == 0) {
            ss.push(value.replace('<FUNC>', '').trim());
            return;
        }
        if (uValue.indexOf('<RAW>') == 0) {
            ss.push(prefix + "`" + f + "`=" + value.replace('<RAW>', '') + "");
            return;
        }
        if (uValue.indexOf(' AGO>') > 0) {
            var tag = value.split('AGO >')[0].replace("<", "").trim();
            var unit = tag.split(" ")[0];
            var compare = value.split(' AGO>')[1].trim();
            ss.push("TIMESTAMPDIFF(" + unit + ", " + prefix + "`" + f + "`, NOW()) " + compare + "");
            return;
        }
        if (uValue.indexOf(':>') == 0) {
            var xvalue = value.replace(':>', '>').trim();
            ss.push(prefix + "`" + f + "`" + xvalue);
            return;
        }
        if (uValue.indexOf(':<') == 0) {
            var xvalue = value.replace(':<', '<').trim();
            ss.push(prefix + "`" + f + "`" + xvalue);
            return;
        }

        //-----------------------------------------------------------

        //-----------------------------------------------------------

        switch (typeof value) {
            case 'object':
                var xvalue = JSON.stringify(value);
                xvalue = (xvalue.length > 0) ? xvalue.replace(/\'/g, "\\'") : '';
                ss.push(prefix + "`" + f + "`='" + xvalue + "'");
                break;
            case 'number':
                ss.push(prefix + "`" + f + "`='" + value + "'");
                break;
            default:
                ss.push(prefix + "`" + f + "`='" + value.replace(/\'/g, "\\'") + "'");
                break;
        } // switch

    });

    if (delimiter != ',') {
        for (var i = 0; i < ss.length; i++) {
            ss[i] = "(" + ss[i] + ")";
        }
    }

    // _( ss.join(delimiter) );

    return ss.join(delimiter);
}

Brain2 = (class Brain2 {

	// static NOW = "NOW()";

	constructor (name) {
		this.name = name;
        this.NOW = "NOW()";
        this.FORCE = true;

		this.db = new DB3({
			'url': 'https://vli.earns.io/_jSQL2.php',
			'dbname': 'vli_site',
			'user': 'adminsexy',
			'pass': 'Abcd1234#',
			'server': 'localhost',
		});

		this.table = this.db.table;

        this.loaded_format_functions = [];

		this._init_database();
	}

	//--- set ---//
    set_ai (ai) {
        this.ai = ai;
        return this;
    }

	//--- queue ---//
	queue_reset () {
		this.sqls = [];
		return this
	}
	queue (sqls) {
		sqls = typeof sqls == 'string' ? [sqls] : sqls;
		this.sqls = this.sqls || [];
		this.sqls = this.sqls.concat(sqls);
		return this
	}
	queue_save (field, value) {
        var row = row || {};
        var row_update = row_update || {};

        if (this.ai instanceof AI200) row.ai = this.ai.name;

		row.created_at = this.NOW;
        row.field = field;
        row.value = value;

        row_update.value = value;
        row_update.updated_at = this.NOW;

        return this.queue( app.table.ai_know.sql_insertUpdateRow(row, row_update) )
	}
	queue_process () {
		var db = this.db;
		var self = this;

        if (!self.sqls.length) return this;

		return db.Query({
			sql: self.sqls.join(";"),
			// debug: 1,
		})
	}

	//--- save ---//
	save (field, new_value, force = false) {

        if (!force) {
            if (JSON.stringify(this.known(field)) == JSON.stringify(new_value)) {
                return this;
            }
        }

        var row_new = {}
		row_new['ai'] = this.name;
		row_new['field'] = field;
		row_new['value'] = new_value;
		row_new['created_at'] = this.NOW;

        if (typeof new_value === 'object') row_new['value_type'] = 'json';
        if (typeof new_value === 'number') row_new['value_type'] = 'number';

        var row_update = {}
		row_update['value'] = new_value;
		row_update['value_type'] = row_new['value_type'];
		row_update['updated_at'] = this.NOW;

		app.table.ai_know.insertUpdateRow(row_new, row_update)

        return this;
	}
    save_to_knowledge (field, new_values) {
        var knowledge = this.known(field); if (knowledge == undefined) this.load(field);
        var knowledge = this.known(field) || [];

        if (typeof new_values === 'string') new_values = new_values.split(",");

        var need_save = false;
        var new_knowledge = knowledge
        new_values.forEach(new_value => {
            var is_exist = false;
            knowledge.forEach(kn => {
                if (is_exist) return;
                is_exist = JSON.stringify(kn) == JSON.stringify(new_value)
            })
            if (!is_exist) new_knowledge.push( new_value );
            if (!is_exist) need_save = true;
        })

        // console.log("new_values", new_values);
        // console.log("new_knowledge", new_knowledge);

        if (need_save)  this.save(field, new_knowledge, this.FORCE);

        return this;
    }
    remove_from_knowledge (field, new_value) {
        var knowledge = this.known(field); if (knowledge == undefined) this.load(field);
        var knowledge = this.known(field) || [];

        var need_save = false;
        var new_knowledge = []
        knowledge.forEach(kn => {
            if (JSON.stringify(kn) == JSON.stringify(new_value)) return;
            need_save = true;
            new_knowledge.push( kn );
        })


        if (need_save)  this.save(field, new_knowledge, this.FORCE);

        return this;
    }

	//--- known ---//
    known (field) {
        if ( this.loaded == undefined ) this.load(field);
        if ( this.loaded == undefined  ||  this.loaded.length < 1 ) return;

        //--- UNDEFINED field ---//
        if (field == undefined) {
            var out = {}
            this.loaded.forEach(know => {
                out[ know.field ] = know.value;
            })
            return out;
        }

        //--- DEFINED field ---//
        var loaded = this.loaded.filter(row => {return row.field == field})

        return loaded.length ? loaded[0].value : undefined;
    }
    unknown (field) {
        return this.known(field) == undefined;
    }

	//--- get ---//
	get (field) {
        var ret = app.table.ai_know.selectRows({
            ai: this.name,
            field: field,
        }, 1)
		return ret.length ? ret[0].value : null ;
	}

    //--- load ---//
	loaded_format (f) {
        this.loaded_format_functions.push(f);
        return this;
    }
	load (field, group) {
        var brain = this;
        var ai = brain.ai;
        var where = {ai: this.name}

        if (group != undefined) where.group = group;
        if (field != undefined) where.field = field;

		brain.loaded = app.table.ai_know.selectRows(where)

        // console.log("brain.loaded", brain.loaded);

        brain.loaded.forEach(row => {

            switch (row.value_type) {
                case 'json': row.value = row.value.to_json(); break;
                case 'number': row.value = row.value*1; break;
            }

            brain.loaded_format_functions.forEach(func => {
                func.apply(brain, [row]);
            })
        })

        if (ai instanceof AI200) {
            ai.know("brain_loaded", true);

            brain.loaded.forEach(row => {
                ai.know[row.field] = row.value;
            })
        }

        return this;
	}

	//--- init ---//
	_init_database () {
		// var db = this.db;
        // db.ai_know = new DBTable('ai_know', this.db);
		// db.use_table("ai_know").then(table => {
		// 	table.defineUnique('unique', function(row) { return "<RAW> '"+[row.ai, row.field].join(",")+"'" });
		// });
	}
})
AI200_ActionTask = (class AI200_ActionTask {
	constructor (name, f) {
		this.name = name;
		this.f = f;

		this.calls = [];

		this.output = undefined;
	}

	do (input, data, action, ai) {
		this.log();
		this.output = this.f.apply(this, [this, input, data, action, ai]);
		return this.output;
	}

	log () {
		this.calls.push(new Date().getTime())
		return this;
	}
	ago () { // return miliseconds ago since last called
		return new Date().getTime() - this.calls.last();
	}
})
AI200_Action = (class AI200_Action {
	constructor (name) {
		this.name = name
		this.requires_environment = []
		this.requires = []
		this.tasks = []

		this.input = {}
		this.expect = {}
		this.task = {}
		this.logic = {}
		this.setting = {}

		this.data = {}

		this.debugging = 0;
	}


	// --- do
	do (input, ai, brain, ui, logic) {
		var action = this;
		var data = action.data;
		var slowly = 0;
		var debug = this.debugging || 0;
		// var do_timeout = this.timeout || this.default_timeout;

		action.input = input || {};

		if (!action.requirement_ok(action.input, ai)) {
			// this.debug();
			console.error(`Requirement for action '${action.name}' (${ai.name}) is invalid!`)
			// this.debugEnd();
			return false;
		}

		action.output = undefined;
		action.last_task = undefined;

		function recursive (logic) {

			if (typeof logic === 'string') {
				var new_logic = {}
				new_logic[logic] = {};
				logic = new_logic;
			}

			for (var task_name in logic) {
				var action_logic = logic[task_name];
				var task = action.task[ task_name ];

				if (task == undefined) break;

				if (debug) window.console.group(task_name)

				//--------------------
				//--- task process ---
                action.output = task.do(action.input, data, action, ai)
				//--- task process ---
				//--------------------



				// if (debug) window.console.log(`%c${task.name} =>`, "color:#4F4F4F", action.output);
				if (debug) window.console.log(`%c${task.name} =>`, "color:#4F4F4F", action.output, 'remain', action_logic);

				//--- remain logic
				for (var action_return in action_logic) {

                    var is_matched = action.output == action_return.toTypeOf(action.output);

                    if (is_matched) {
						var next_logic = action_logic[action_return];

						if (debug) window.console.log(`%cvs`, 'color:green', action_return, ":", is_matched) //, "-> next_logic", next_logic);

						recursive( next_logic );

					} else {
						if (debug) window.console.log(`%cvs`, 'color:red', action_return, ":", is_matched);
					}

				}

				if (debug) window.console.groupEnd()
			}
			//---------------

			return ;
		} // recursive


		if (debug) window.console.group(`%c-- ${ai.name}.${action.name} --`, "color: green");
		recursive(logic || action.logic);
		if (debug) window.console.groupEnd();

		return this.output;
	}


	is_environment_ok (input, ai) {
		if (this.requires_environment == undefined || this.requires_environment.length < 1) return true;
		var debug = this.debugging || 0;
		var self = this;
		var ok = true;

		if (debug) window.console.log("Environment", "green")
		this.requires_environment.forEach(function(require) {
			if (!ok) return;
			ok &= ai.do( require.field ) !== false;

			if (!ok && debug) window.console.error(`Environment '${require.field}' is false`)
		})

		if (ok && debug) window.console.log(`Environments for action '${self.name}' is ready!`, "green")

		return ok;
	}
	is_input_ok (input, ai) {
		if (this.requires == undefined || this.requires.length < 1) return true;
        input = input || {}

		var debug = this.debugging || 0;
		var self = this;
		var ok = true;

		//--- default
        this.requires.forEach(function(require) {
			if (require.setting.default == undefined) return;
			if (input[require.field] != undefined) return;

			input[require.field] = require.setting.default
		})

        //--- knowledge
		this.requires.forEach(function(require) {
			if (require.setting.knowledge == undefined) return;
			if (ai.known(require.setting.knowledge) == undefined) return;
			if (input[require.field] != undefined) return;

			input[require.field] = ai.known(require.setting.knowledge)
		})

		//--- require
		this.requires.forEach(function(require) {
			if (!ok) return;

			if (require.setting.optional) return;

			if (input[require.field] == undefined) {
				ok = false;
				if (debug) window.console.error(`Action '${self.name}' is missing '${require.field}'`)
			}

			if (!ok && debug) window.console.error(`Input '${require.field}' is invalid`)
		})


		if (ok && debug) window.console.log(`%cInputs for action '${self.name}' is ready!`, "color: green")
		if (!ok && debug) window.console.error("input", input)

		return ok;
	}
	requirement_ok (input, ai) {
		if (!this.is_environment_ok(input, ai)) return false;
		if (!this.is_input_ok(input, ai)) return false;
		return true;
	}


	//--- debug
	debug () {
		this.debugging = true;
		return this;
	}
	debugEnd () {
		this.debugging = false;
		return this;
	}


	//--- stop
	clear_stop () {
		this._force_stop = false;
		return this;
	}
	stop () {
		this._force_stop = true;
		return this;
	}
	is_force_stop () {
		if (this._force_stop === true) window.console.error("FORCE STOP action '"+this.name+"'!")
		return this._force_stop === true
	}


	//--- set_
	set_logic (data) {
		var self = this;
		data = data || {};
		this.logic = $.extend({}, data);

		//--- no logic data ---
		if (Object.keys(this.logic).length == 0) {
			if (this.tasks.length) this.tasks.forEach(task => {
				self.logic[ task.name ] = {}
			})
		}

		return this;
	}
	set_require_environment (data) {
		if (data == null) return this;

		for (var field in data) this.requires_environment.push({
			field: field,
			setting: data[field],
		});

		return this;
	}
	set_require (data) {
		if (data == null) return this;

		for (var field in data) this.requires.push({
			field: field,
			setting: data[field],
		});

		for (var field in data) this.input[field] = 1;

		return this;
	}
	set_task (data) {
		var self = this;
		data = data || {}
		this.task = $.extend(this.task, {}, data);

		for (var name in data) {

			var task = new AI200_ActionTask( name, data[name] )

			this.task[name] = task
			this.tasks.push(task)
		}

		return this;
	}
	set_expect (data) {
		if (data == null) return this;
		this.expect = $.extend(this.expect, {}, data);
		return this;
	}
	set_setting (data) {
		if (data == null) return this;
		this.setting = $.extend(this.setting, {}, data);
		return this;
	}
})
AI200 = (class AI200 {
	constructor (name, input) {
		this.name = name || "";

		this.actions = [];

		this.action = {};
		this.last_action = null;

        this.brain = new Brain2(this.name).set_ai(this);

    	// this.memory = new Memory(name)
		// this.ui = new UI(name)
		// this.m = new Manipulation(name)
		// this.ui.ai = this;

		this.input = input;

        this.know_data = {};
		this.know_actions = {};
		this.know_all_actions = {};

		this.debuging = 0;

		this._init();
	}

	//--- Do
	do (action_name, input, logic) {
		var action = this.action[action_name]

		if (action == undefined) return false;
		if (!action instanceof AI200_Action) return false;

		if (this.debugging) action.debug();

		action.do(input, this, this.brain, this.ui, logic);

		this.output = action.output;

		return this.output;
	}

	//--- knowledge
    on_knows (fields, f) {
        if (typeof fields === 'string') fields = fields.split(",");
        fields = fields.map(field => {return field.trim()});

        this.know_all_actions[fields.join(",")] = this.know_all_actions[fields.join(",")] || [];

        this.know_all_actions[fields.join(",")].push(f);

        return this;
    }
    on_know (fields, f) {
        if (typeof fields === 'string') fields = fields.split(",");
        var ai = this;
        fields.forEach(field => {
            field = field.trim();
            ai.know_actions[field] = ai.know_actions[field] || [];
            ai.know_actions[field].push(f);
        })
        return this;
    }
    know (field, new_value) {
        var ai = this;

        ai.know_data[field] = ai.know_data[field] || {
            value: undefined,
            knew_at: undefined,
            _history: [],
            ago: function() {
                return new Date().getTime() - this.knew_at;
            }
        }

        var o = ai.know_data[field];

        if (o.value !== new_value) {
            o.prev_value = o.value;
            o.value = new_value;
            o.knew_at = new Date().getTime();
            o._history.push({
                value: new_value,
                knew_at: new Date().getTime(),
            })

            // _(`%c${this.name} knew `, "color: green", `${field} =`, new_value)

            //--- Do singal action
            if (ai.know_actions[field] && ai.know_actions[field].length && new_value != undefined) {
                ai.know_actions[field].forEach(f => {
                    f.apply(ai, [new_value, field])
                })
            }

            //--- Do all actions related to field
            for (var group_fields in ai.know_all_actions) {
                var ff = ai.know_all_actions[group_fields];

                group_fields = group_fields.split(",");
                if (group_fields.indexOf(field) < 0) continue;

                var ai = this;
                var knew_all = true;
                group_fields.forEach(gfield => {
                    if (!knew_all) return;
                    knew_all &= ai.know_data[gfield] != undefined
                            && ai.know_data[gfield].value != undefined
                            && ai.know_data[gfield].value != null
                });

                if (knew_all) {
                    var field_data = {};
                    var know_datas = [];
                    group_fields.forEach(gfield => {
                        field_data[gfield] = ai.know_data[gfield].value;
                        know_datas.push( ai.know_data[gfield].value );
                    });

                    ff.forEach(f => {
                        f.apply(ai, [field_data]);
                    });
                }
            }
        }

        return this;
    }
    known (field) {
        var value = `know_data[field].value`.safe(undefined, {know_data: this.know_data, field: field})
        return value;
    }
    unknown (field) {
        var value = `know_data[field].value`.safe(undefined, {know_data: this.know_data, field: field})
        return value == undefined;
    }

    forget (fields) {
        var ai = this;

        if (typeof fields === 'string') fields = fields.split(",");

        fields.forEach(field => ai.know(field, undefined))

        return this;
    }
    save_knowledge (field) {
        // console.group("saving knowledge", field);

        var in_brain = this.brain.known(field)
        var in_ai = this.known(field)

        if (typeof in_brain == 'object') in_brain = JSON.stringify(in_brain)
        if (typeof in_ai == 'object') in_ai = JSON.stringify(in_ai)

        if (!isNaN(in_brain)) in_brain = in_brain*1;
        if (!isNaN(in_ai)) in_ai = in_ai*1;

        // console.log(in_brain == in_ai, "in_brain", in_brain, "in_ai", in_ai);

        if (in_brain != in_ai) {
            this.brain.save(field, this.known(field))
        } else {
            // console.log("already in brain");
        }

        // console.groupEnd();

        return this;
    }
    show_knowledge () {
        var out = {}
        for (var field in this.know_data) {
            out[field] = this.know_data[field].value;
        }
        console.log(`${this.name} knowledge`, out);
        return this;
    }


	//--- Learn
	learn (action_name, knowledge) {
		var action = new AI200_Action(action_name);

		action.set_require_environment( knowledge.require_environment );
		action.set_require( knowledge.require );
		action.set_task( knowledge.task );
		action.set_setting( knowledge.setting );
		action.set_expect( knowledge.expect );
		action.set_logic( knowledge.logic );

		this.actions.push(action);
		this.action[action_name] = action;

		return this;
	}


    //--- bulk
	set_bulk (method, setting) {
		var ai = this;
		ai.on_each(setting, function (field, data) {
			if (typeof ai[method] !== 'function') return;
			// _("set_bulk", field, "|", data);
			ai[method].apply(ai, [field, data]);
		})
		return this;
	}
	on_know_do (fields, f) {
		var ai = this;
		switch (typeof f) {
			case 'string': {
				f.split(",").forEach(func_name => {
					ai.on_know(fields, (value, field) => {
						ai.do(func_name);
					})
				})
				break;
			}
			case 'function': {
				ai.on_know(fields, f)
				break;
			}
		}
		return this;
	}
	on_knows_do (fields, f) {
		var ai = this;
		switch (typeof f) {
			case 'string': {
				f.split(",").forEach(func_name => {
					ai.on_knows(fields, (data) => {
						ai.do(func_name);
					})
				})
				break;
			}
			case 'function': {
				ai.on_knows(fields, f)
				break;
			}
		}
		return this;
	}


	//--- debug
	debug () {
		this.debugging = 1;
		return this;
	}
	debugEnd () {
		this.debugging = 0;
		return this;
	}


	//--- Private
	_init () {
		if (typeof this.brain_init === 'function') this.brain_init.apply(this, [this]);
		if (typeof this.learning === 'function') this.learning.apply(this, [this]);
		// if (typeof this.ui_building === 'function') this.ui_building.apply(this, [this.ui, this]);
		return this;
	}
})
AI_Module = (class AI_Module extends AI200 {
        construct (setting) {
            this.learn("something", setting);
        }
    })
aiObjectDB = (class aiObjectDB extends AI200 {
    constructor (name = null) {
        super("aiObjectDB_"+name);
        
        this.type                           = null;
        this.target_table                   = null;
        this.item_field                     = null;
        this.meta_tables                    = [];
        this.update_fields                  = [];
        this.$$_selectors                   = [];
        
        this.source_unique_detectors        = [];
        this.source_url_detector            = null;
        
        this.crawling                       = [];
        this.crawlers                       = [];
        this.metas                          = [];
        this.sqls                           = [];
        
        this.set_type (name);
    }
    
    
    
    
    detect_source_unique (type, func) {
        if (typeof func !== 'function') return this;
        
        this.source_unique_detectors.push({
            type:       type.toLowerCase(),
            func:       func,
        })
        return this;
    }
    detect_source_url (func) {
        if (typeof func !== 'function') return this;
        
        this.source_url_detector = func;
        return this;
    }
    
    set_$$_selector (type, data) {
        this.$$_selectors.push({
            type        : type,
            data        : data,
        });
        return this;
    }
    
    set_crawler_data (data) {
        this.crawler_data       = data;
        return this;
    }
    
    set_update_fields (fields) {
        if (typeof fields == 'string') fields = fields.split(",").map(f => f.trim());
        this.update_fields = typeof fields === 'object' ? fields : [];
        
        return this;
    }
    
    set_table_meta (table_meta, short_name = "meta") {
        short_name = short_name == null ? this.meta_tables.length : short_name; 
        this.meta_tables.push({
            short_name          : short_name,
            table               : table_meta,
        })
        
        return this;
    }
    
    set_db (db) {
        this.db = db;
        return this;
    }
    
    set_type (type) {
        if (type == null) return this;
        this.type               = type;
        this.target_table       = type;
        this.item_field         = null || type;
        return this;
    }
    
    on_crawling (func) {
        this.func_crawling = func;
        return this;
    }
    on_crawled (func) {
        this.func_crawled = func;
        return this;
    }
    crawl ($$, crawler) {
        var ai = this;
        if (typeof ai.func_crawling !== 'function') return this;
        console.log("%ccrawl", "color: dimgray");
        this.crawled = ai.func_crawling.apply(ai, [$$, crawler]);
        console.log("%ccrawled", "color: dimgray", this.crawled);
        return this;
    }
    do_crawled (crawler) {
        var ai = this;
        if (typeof ai.func_crawled !== 'function') return this;
        console.log("%cdo_crawled", "color: dimgray");
        ai.func_crawled.apply(ai, [ai.crawled, crawler]);
        return this;
    }
    
    
    
    sql_insert_crawlers () {
        if (this.crawlers.length < 1) return [];
        var ai = this;
        var sqls = [];
        this.crawlers.forEach(crawler => {
            sqls.push(
                ai.db.sql_insert_update("_crawler", $.extend({}, crawler), {updated_at: WPDB.UNIX_NOW})
            )
        })
        return sqls;
    }
    sync_crawlers_db () {
        var ai = this;
        this.db
            .select("_crawler", "*", {
                source_type     : ai.type,
                source_unique   : {in: ai.crawlers.map_by('source_unique')},
            }).then(rows => {
                arrays_match(ai.crawlers, rows || []
                    , (crawler, row) => crawler.source_unique == row.source_unique
                    , (crawler, row) => {
                        crawler = $.extend(crawler, row)
                    }
                )
            })
        return this;
    }
    reset_new_crawlers () {
        this.crawlers = [];
        return this;
    }
    detect_new_crawlers ($$, root) {
        var ai = this;
        
        if (ai.$$_selectors.length < 1) {
            console.error("No $$_selectors !!!");
            return ai;
        }
        if (ai.source_unique_detectors.length < 1) {
            console.error("No source_unique_detectors !!!");
            return ai;
        }
        
        ai.$$_selectors.forEach(selector => {
            
            console.group("DETECT TYPE: ", selector.type, ai.type)
            
            $$(selector.data).forEach(e => {
                
                var source_unique = null;
                var source_url = null;
                
                ai.source_unique_detectors.filter(detector => detector.type == selector.type).forEach(detector => {
                    switch (selector.type) {
                        case 'href': 
                            source_unique = detector.func.apply(ai, [e.attr('href')]);
                            break;
                        case 'text': 
                            source_unique = detector.func.apply(ai, [e.text()]);
                            break;
                    }
                    
                })
                
                if (typeof ai.source_url_detector === 'function') {
                    source_url = ai.source_url_detector.apply(ai, [e.attr('href'), root]);
                    console.log("%csource_url", "color: gray", source_url);
                }
                
                if (source_unique != null) {
                    
                    console.log(this.type + " found %c" + source_unique, "color: yellow");
                    
                    var new_crawler = $.extend({
                        target_table                : ai.type,
                        source_type                 : ai.type,
                        source_unique               : source_unique,
                        source_url                  : source_url,
                    }, ai.crawler_data)
                    
                    
                    if (source_unique == null) return;
                    if (source_unique == ai.type) return;
                    if (source_unique[0] == "#") return;
                    if (ai.crawlers.map_by('source_unique').has(source_unique)) return;
                    
                    ai.crawlers.push( new_crawler );
                }
            })
            console.groupEnd();
        })
        
        return this;
    }
    load_crawlers_db () {
        var ai = this;
        
        if (ai.crawlers.length < 1) return this;
        
        console.log("load_db_crawlers %c" + this.type, "color: yellow", this.crawlers.length, {
            source_type     : ai.type,
            source_unique   : {in: ai.crawlers.map_by('source_unique')},
        });
        
        ai.db.query( ai.sql_insert_crawlers() )
        
        ai.sync_crawlers_db ()
            
        //-- Insert target_id = null
        
        var sqls = [];
        var cc = this.crawlers
            .filter(crawler => crawler.id > 0)
            .filter(crawler => crawler.target_table != null)
            .filter(crawler => crawler.target_id == null)
        console.log("%cFiltered target_id = null", "color: gray", cc.length)
        
        //-- Create new item
        cc.forEach(crawler => sqls.push(
            ai.db.sql_insert_update(ai.target_table, {_crawler : crawler.id}, {_crawler : crawler.id})
        ))
        console.log("%cCreate new item", "color: gray", sqls.length)
        
        if (sqls.length) {
            ai.db.query( sqls );
            
            //-- Load id from target_table
            console.log("%cLoad id from target_table", "color: gray")
            var sqls = [];
            ai.db.select(ai.target_table, "id, _crawler", {
                _crawler : {in: cc.map_by('id')},
            }).then(items => {
                items.forEach(item => {
                    item.id = item.id*1;
                    sqls.push( ai.db.sql_update("_crawler", {target_id : item.id}, {id : item._crawler}) )
                    cc.filter(c => c.id == item._crawler).forEach(crawler => crawler.target_id = item.id)
                })
            });
            ai.db.query( sqls );
            
            ai.sync_crawlers_db()
        }
        
        return this;
    }
    load_metas () {
        var ai = this;
        ai.metas = [];
        ai.meta_tables.forEach(meta_table => {
            var where = {}
            var where_in = ai.crawlers.filter(c => c.target_id > 0).map_by('target_id');
            
            where[ai.type] = {in: where_in}
            
            console.log("%c"+meta_table.table, "color: yellow", "where", where);
            
            ai.db.select(meta_table.table, "*", where).then(metas => {
                // console.log("%c"+meta_table.table, "color: yellow", "metas", metas, where);
                if (metas.length < 1) return;
                metas.forEach(meta => meta.source_type = ai.type);
                ai.metas = ai.metas.concat(metas).uniqueBy('id');
            })
        })
        
        console.log("%cmetas of "+ai.type+" is loaded!!!", "color: gray", ai.metas.length);
        
        return this;
    }
    
    map_to (obj) {
        var ai = this;
        
        function recursive (items) {
            if (items.jquery != null) return;
            if (items == null) return;

            if (items._crawler == undefined) {
                if (items.source_unique != null  &&  items.source_type != null) {
                    // console.group( Object.keys(items).join(",") );
                    // console.log("items", items);
                    arrays_match([items], ai.crawlers
                        , (item, crawler) =>
                                item.source_unique.toLowerCase() == crawler.source_unique.toLowerCase()
                            &&  item.source_type.indexOf(crawler.source_type) == 0
                        , (item, crawler) => {
                            item._crawler   = crawler
                            item.id         = crawler.target_id * 1
                            item.metas      = ai.metas.filter(meta => meta[ai.item_field] == crawler.target_id)
                        }
                    );
                    // console.groupEnd();
                }
            }


            for (var field in items) {
                if (field == "source_unique")   continue;
                if (field == "source_type")     continue;
                if (field == "_crawler")        continue;
                if (items[field] == null)       continue;

                if (typeof items[field] === 'object') {
                    if (items[field].length > 0  &&  typeof items[field].forEach == 'function') {
                        items[field].forEach(item => recursive(item));
                    } else {
                        recursive( items[field] )
                    }
                }
            }

        } //--- recursive
        
        recursive (obj);
        
        return this;
    }
    
    log (s) {
        console.log.apply(this, arguments);
        return this;
    }
    
    
    id (id) {
        this.item_id    = id * 1;
        // this.sqls       = [];
        return this;
    }
    new_meta (table) {
        var ai = this;
        
        switch (typeof table) {
            case 'number':      table = ai.meta_tables[table].table; break;
            case 'string':      
                var t = ai.meta_tables.filter(tb => tb.short_name == table || tb.table == table);
                table = t.length ? t[0].table : table || ai.meta_tables[0].table; 
                break;
            default:            table = table || ai.meta_tables[0].table; break;
        }
        
        // xxx.new_meta("google_app_meta_2").k("date_modified").v(3453453).add({value: {"min length": 0}})
        
        function meta (table) {
            this.insert_data = {};
            this.update_data = {};
            
            this.g = function(value) {
                this.insert_data['group'] = value;
                return this;
            }
            this.k = function(value) {
                this.insert_data['key'] = value;
                return this;
            }
            this.l = function(value) {
                this.insert_data['lang'] = value;
                return this;
            }
            this.t = function(value) {
                this.insert_data['time'] = value;
                return this;
            }
            this.a = function(value) {
                this.insert_data['at'] = value;
                return this;
            }
            this.v = function(value) {
                if (value != null && typeof value === 'object') {
                    if (value.length) value = value.join(",");
                    else value = JSON.stringify(value);
                }
                this.insert_data['value'] = value;
                return this;
            }
            this.i = function(value) {
                this.insert_data['item'] = value;
                return this;
            }
            this.int = function(value) {
                this.insert_data['int'] = value * 1;
                return this;
            }
            this.f = function(value) {
                this.insert_data['for'] = value;
                return this;
            }
            this.n = function(value) {
                if (value != null && typeof value === 'object') {
                    if (value.length) value = value.join(",");
                    else value = JSON.stringify(value);
                }
                this.insert_data['note'] = value;
                return this;
            }
            this.s = function(value) {
                this.insert_data['status'] = value;
                return this;
            }
            this.ua = function(value) {
                this.insert_data['updated_at'] = value != null ? value : data.now;
                return this;
            }
            
            this.add = function(cond) {
                console.log("meta.add %c" + table, "color: gray", ai.item_id, this.insert_data)
                
                if (!(ai.item_id > 0)) return ai.log(`%c- Skip add because item_id is invalid`, "color: red");
                
                // Conditions
                if (typeof cond === 'object') {
                    for (var field in cond) {
                        if (this.insert_data[field] === undefined) return ai.log(`%c- Skip add because field ${field} is undefined`, "color: red");

                        if (typeof cond[field] === 'object') {
                            for (var type in cond[field]) {
                                var value = this.insert_data[field];
                                var cond_value = cond[field][type];
                                switch (type) {
                                    case ">":
                                        if (isNaN(value)) return ai.log(`%c- Skip add because value is NaN`, "color: red");
                                        if (typeof cond_value != 'number') return ai.log(`%c- Skip add because cond_value is not number`, "color: red");
                                        if (value <= cond_value) return ai.log(`%c- Skip add because field ${field} >`, "color: red");
                                        break;
                                    case "<":
                                        if (isNaN(value)) return ai.log(`%c- Skip add because value is NaN`, "color: red");
                                        if (typeof cond_value != 'number') return ai.log(`%c- Skip add because cond_value is not number`, "color: red");
                                        if (value >= cond_value) return ai.log(`%c- Skip add because field ${field} <`, "color: red");
                                        break;
                                    case "has":
                                        if (typeof value !== 'string') return ai.log(`%c- Skip add because field ${field} is not string`, "color: red");
                                        if (value.indexOf(cond_value) < 0) return ai.log(`%c- Skip add because field ${field} not appear`, "color: red");
                                        break;
                                    case "min length":
                                        if (typeof value !== 'string') return ai.log(`%c- Skip add because field ${field} is not string`, "color: red");
                                        if (value.length < cond_value) return ai.log(`%c- Skip add because field ${field} min length`, "color: red");
                                        break;
                                }
                            }
                        } else {
                            var value = this.insert_data[field];
                            var cond_value = cond[field];
                            if (value != cond_value) return ai.log(`%c- Skip add because field ${field} value`, "color: red");
                        }
                    }
                }
                
                this.insert_data[ai.item_field] = ai.item_id;

                // Check duplicated from metas
                if (ai.metas.length  &&  ai.metas.found( this.insert_data )) {   // typeof cond === 'boolean' ? cond : false
                    this.insert_data.is_duplicated = true;
                    ai.sqls.push("# -- duplicate -- " + JSON.stringify(this.insert_data))
                    return ai;
                }
                
                if (ai.update_fields.length) {
                    ai.update_fields.forEach(field => {
                        if (this.insert_data[field] == undefined) return;
                        this.update_data[field] = this.insert_data[field]
                    });
                }

                if (Object.keys(this.update_data).length < 1) {
                    this.update_data[ai.item_field] = ai.item_id;
                }
                
                var sql = ai.db.sql_insert_update(table, this.insert_data, this.update_data);
                ai.sqls.push( sql )
                ai.sqls = ai.sqls.unique();
                
                return ai;
            }
        }
        
        return new meta(table);
    }
    save_metas () {
        if (this.sqls.length < 1) return this;
        this.db.query( this.sqls )
        return this;
    }
    
    
    learning (ai) {
        
    }
    
})
aiGmailOLD = (class aiGmailOLD extends AI200 {
	constructor(name) {
		super("aiGmail_"+name);
	}

	learning(ai) {
        //--- KNOWING ---//

        //--- ABILITY ---//
        ai.learn("copy&paste content", {
			require: {
				"content": {},
			},
			logic: {
				"prepare content": {true: {
					"paste": {}
				}}
			},
			task: {
				"prepare content": (task, input, data, action, ai) => {
					$("#content0").remove();
					$("#contentx").remove();
					$("#copyx").remove();
					$("#copy_test").remove();

					var button = $("<button id=copyx>").text("copy").appendTo($("body"))
                    console.log("button", button, button.style);
					// button.style(`
					button.css('cssText', `
						font-size: 12px;
						position: fixed;
						top: 500px;
						left: 500px;
						background: white;
					`)

                    var div0 = $("<div id=content0>").appendTo( $("body") )
                    // .style(`
                    .css('cssText', `
						background: white;
					`)
                    // var copy_test = $("<textarea id=copy_test>").appendTo( div0 ).style(`
					// 	font-size: 12px;
					// 	position: fixed;
					// 	top: 500px;
					// 	left: 300px;
					// 	background: white;
					// `)

					var div = $("<div id=contentx>").appendTo(div0).html( input.content );
					// div.style(`
					div.css('cssText', `
						position: fixed;
						top: 500px;
						left: 500px;
						background: white;
					`)

					button.click(function() {
						window.getSelection().removeAllRanges();
						window.focus();
						var range = window.document.createRange();
						range.selectNode(window.document.getElementById("contentx"));

                        window.getSelection().addRange(range);

                        for (var i=0; i<3; i++) {
                            IIM_OLD.Wait(0.5);
    						window.document.execCommand("copy");
                            _("Copied");
                        }

                        // $("#copyx").hide();
                        // $("#content0").hide();
					});


					return true;
				},
				"paste": (task, input, data, action, ai) => {
                    data.init_length = $("div[contenteditable=true]").text().trim().length;

                    console.log("Before paste length", data.init_length);

					return new OLD$$()
						.wait("div[role=button]:contains('Send')")
						.eClick("input[name=subjectbox]").delay(1)
						.Try(4, x => new OLD$$()
							.eClick("#copyx").delay(0.5)
							.eClick("#copyx").delay(0.5)
							.eClick("#copyx").delay(0.5)
							.eClick("div.editable").delay(1)
							.f(x => {
								var pasteText = window.document.querySelector("div.editable");
								if (pasteText != null) pasteText.focus();
								window.document.execCommand("paste");

                                return true;
							})
							.wait(x => {

                                console.log("After paste length", $("div[contenteditable=true]").text().trim().length);

                                data.new_length = $("div[contenteditable=true]").text().trim().length;
                                return data.new_length > data.init_length + input.content.length / 2
							})
							.go()
						)
						.go()
				},
			}
		}) // ready
		ai.learn("load new mail page", {
			require: {
				"send_to": {},
				"subject": {},
			},
			task: {
				"load page": (task, input, data, action, ai) => {

					var url = `https://mail.google.com/mail/?view=cm&fs=1&to=${input.send_to}&su=${encodeURI(input.subject)}`;
                    
                    new $$$()
                        .try_load_url(1,0
                            , "http://lib.mixseo.net/blank.php", 1
                            , x => {
                                return window.location.href.get_domain() == "lib.mixseo.net";
                            }, 0
                        )
                        .go()
                    
                    return new $$$()
                        .try_load_url(1,0
                            , url, 15
                            , x => {
                                return $("div.editable").length > 0 && $("div[role=button]:contains('Send')").length > 0
                            }, 1
                        )
                        .wait(x => {
                            return $("div.editable").length > 0 && $("div[role=button]:contains('Send')").length > 0
                        }, 1)
                        .go()
				},
			}
		}) // ready
        ai.learn("load new mail page OLD", {
			require: {
				"send_to": {},
				"subject": {},
			},
			task: {
				"load page": (task, input, data, action, ai) => {

					var url = `https://mail.google.com/mail/?view=cm&fs=1&to=${input.send_to}&su=${encodeURI(input.subject)}`;

					new OLD$$()
						.LoadUrl('http://lib.mixseo.net/blank.php').delay(0.3)
						.go()

					return new OLD$$()
						.LoadUrl(url).delay(5)
						.wait(function() {
							return $found("div.editable") && $found("div[role=button]:contains('Send')")
						}, 40)
						.go()
				},
			}
		}) // ready
        ai.learn("fill subject", {
			require: {
				"subject": {},
			},
			task: {
				"fill": (task, input, data, action, ai) => {
				    return new $$$()
				        .jfill("input[name=subjectbox]", "")
				        .efill("input[name=subjectbox]", input.subject)
				        .wait(x => {
				            return $("input[name=subjectbox]").val() == input.subject
				        })
				        .go()
				},
			}
		}) // ready
        ai.learn("click send", {
			task: {
				"click": (task, input, data, action, ai) => {
                    return new OLD$$()
                        .Try(10, () => { return new OLD$$()
                            .delay(1).jMouseOver("div[role=button]:contains('Send')")
                            .delay(1).eClick("div[role=button]:contains('Send')")
                            .wait("[role=heading]:contains('Error'):visible, span:contains('Message sent'):visible", 1)
                            .delay(1)
                            .wait("[role=heading]:contains('Error'):visible, span:contains('Message sent'):visible", 0.1)
                            .go();
                        })
                        .go()
				},
                "return": (task, input, data, action, ai) => {
                    if ($("span:contains('Message sent'):visible").length) return "success";
                    return "fail";
                },
			}
		}) // ready
    }
})
console.log("aio_300 is loaded (15) modules !");
//--- new cached ---//
