/**
 * Pokemon Showdown Dex
 *
 * Roughly equivalent to sim/dex.js in a Pokemon Showdown server, but
 * designed for use in browsers rather than in Node.
 *
 * This is a generic utility library for Pokemon Showdown code: any
 * code shared between the replay viewer and the client usually ends up
 * here.
 *
 * Licensing note: PS's client has complicated licensing:
 * - The client as a whole is AGPLv3
 * - The battle replay/animation engine (battle-*.ts) by itself is MIT
 *
 * Compiled into battledata.js which includes all dependencies
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
if (typeof window === 'undefined') {
    // Node
    global.window = global;
}
else {
    // browser (possibly NW.js!)
    window.exports = window;
}
var specialAvatars = ['tink_p1', 'tink_p2', 'hatt_p1', 'hatt_p2', 'melmetal_p1', 'melmetal_p2', 'maushold_p1', 'maushold_p2'];
// @ts-ignore
window.nodewebkit = !!(typeof process !== 'undefined' && process.versions && process.versions['node-webkit']);
function toID(text) {
    if (text === null || text === void 0 ? void 0 : text.id) {
        text = text.id;
    }
    else if (text === null || text === void 0 ? void 0 : text.userid) {
        text = text.userid;
    }
    if (typeof text !== 'string' && typeof text !== 'number')
        return '';
    return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
}
function toUserid(text) {
    return toID(text);
}
var PSUtils = new /** @class */ (function () {
    function class_1() {
    }
    /**
     * Like string.split(delimiter), but only recognizes the first `limit`
     * delimiters (default 1).
     *
     * `"1 2 3 4".split(" ", 2) => ["1", "2"]`
     *
     * `splitFirst("1 2 3 4", " ", 1) => ["1", "2 3 4"]`
     *
     * Returns an array of length exactly limit + 1.
     */
    class_1.prototype.splitFirst = function (str, delimiter, limit) {
        if (limit === void 0) { limit = 1; }
        var splitStr = [];
        while (splitStr.length < limit) {
            var delimiterIndex = str.indexOf(delimiter);
            if (delimiterIndex >= 0) {
                splitStr.push(str.slice(0, delimiterIndex));
                str = str.slice(delimiterIndex + delimiter.length);
            }
            else {
                splitStr.push(str);
                str = '';
            }
        }
        splitStr.push(str);
        return splitStr;
    };
    /**
     * Compares two variables; intended to be used as a smarter comparator.
     * The two variables must be the same type (TypeScript will not check this).
     *
     * - Numbers are sorted low-to-high, use `-val` to reverse
     * - Strings are sorted A to Z case-semi-insensitively, use `{reverse: val}` to reverse
     * - Booleans are sorted true-first (REVERSE of casting to numbers), use `!val` to reverse
     * - Arrays are sorted lexically in the order of their elements
     *
     * In other words: `[num, str]` will be sorted A to Z, `[num, {reverse: str}]` will be sorted Z to A.
     */
    class_1.prototype.compare = function (a, b) {
        if (typeof a === 'number') {
            return a - b;
        }
        if (typeof a === 'string') {
            return a.localeCompare(b);
        }
        if (typeof a === 'boolean') {
            return (a ? 1 : 2) - (b ? 1 : 2);
        }
        if (Array.isArray(a)) {
            for (var i = 0; i < a.length; i++) {
                var comparison = PSUtils.compare(a[i], b[i]);
                if (comparison)
                    return comparison;
            }
            return 0;
        }
        if (a.reverse) {
            return PSUtils.compare(b.reverse, a.reverse);
        }
        throw new Error("Passed value ".concat(a, " is not comparable"));
    };
    class_1.prototype.sortBy = function (array, callback) {
        if (!callback)
            return array.sort(PSUtils.compare);
        return array.sort(function (a, b) { return PSUtils.compare(callback(a), callback(b)); });
    };
    return class_1;
}());
/**
 * Sanitize a room ID by removing anything that isn't alphanumeric or `-`.
 * Shouldn't actually do anything except against malicious input.
 */
function toRoomid(roomid) {
    return roomid.replace(/[^a-zA-Z0-9-]+/g, '').toLowerCase();
}
function toName(name) {
    if (typeof name !== 'string' && typeof name !== 'number')
        return '';
    name = ('' + name).replace(/[\|\s\[\]\,\u202e]+/g, ' ').trim();
    if (name.length > 18)
        name = name.substr(0, 18).trim();
    // remove zalgo
    name = name.replace(/[\u0300-\u036f\u0483-\u0489\u0610-\u0615\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06ED\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g, '');
    name = name.replace(/[\u239b-\u23b9]/g, '');
    return name;
}
var Dex = new /** @class */ (function () {
    function class_2() {
        var _this = this;
        this.gen = 9;
        this.modid = 'gen9';
        this.cache = null;
        this.statNames = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
        this.statNamesExceptHP = ['atk', 'def', 'spa', 'spd', 'spe'];
        this.pokeballs = null;
        this.resourcePrefix = (function () {
            var _a, _b;
            var prefix = '';
            if (((_b = (_a = window.document) === null || _a === void 0 ? void 0 : _a.location) === null || _b === void 0 ? void 0 : _b.protocol) !== 'http:')
                prefix = 'https:';
            return "".concat(prefix, "//").concat(window.Config ? Config.routes.client : 'play.pokemonshowdown.com', "/");
        })();
        this.fxPrefix = (function () {
            var _a, _b;
            var protocol = (((_b = (_a = window.document) === null || _a === void 0 ? void 0 : _a.location) === null || _b === void 0 ? void 0 : _b.protocol) !== 'http:') ? 'https:' : '';
            return "".concat(protocol, "//").concat(window.Config ? Config.routes.client : 'play.pokemonshowdown.com', "/fx/");
        })();
        this.loadedSpriteData = { xy: 1, bw: 0 };
        this.moddedDexes = {};
        this.moves = {
            get: function (nameOrMove) {
                if (nameOrMove && typeof nameOrMove !== 'string') {
                    // TODO: don't accept Moves here
                    return nameOrMove;
                }
                var name = nameOrMove || '';
                var id = toID(nameOrMove);
                if (window.BattleAliases && id in BattleAliases) {
                    name = BattleAliases[id];
                    id = toID(name);
                }
                if (!window.BattleMovedex)
                    window.BattleMovedex = {};
                var data = window.BattleMovedex[id];
                if (data && typeof data.exists === 'boolean')
                    return data;
                if (!data && id.substr(0, 11) === 'hiddenpower' && id.length > 11) {
                    var _a = /([a-z]*)([0-9]*)/.exec(id), hpWithType = _a[1], hpPower = _a[2];
                    data = __assign(__assign({}, (window.BattleMovedex[hpWithType] || {})), { basePower: Number(hpPower) || 60 });
                }
                if (!data && id.substr(0, 6) === 'return' && id.length > 6) {
                    data = __assign(__assign({}, (window.BattleMovedex['return'] || {})), { basePower: Number(id.slice(6)) });
                }
                if (!data && id.substr(0, 11) === 'frustration' && id.length > 11) {
                    data = __assign(__assign({}, (window.BattleMovedex['frustration'] || {})), { basePower: Number(id.slice(11)) });
                }
                if (!data)
                    data = { exists: false };
                var move = new Move(id, name, data);
                window.BattleMovedex[id] = move;
                return move;
            },
        };
        this.items = {
            get: function (nameOrItem) {
                if (nameOrItem && typeof nameOrItem !== 'string') {
                    // TODO: don't accept Items here
                    return nameOrItem;
                }
                var name = nameOrItem || '';
                var id = toID(nameOrItem);
                if (window.BattleAliases && id in BattleAliases) {
                    name = BattleAliases[id];
                    id = toID(name);
                }
                if (!window.BattleItems)
                    window.BattleItems = {};
                var data = window.BattleItems[id];
                if (data && typeof data.exists === 'boolean')
                    return data;
                if (!data)
                    data = { exists: false };
                var item = new Item(id, name, data);
                window.BattleItems[id] = item;
                return item;
            },
        };
        this.abilities = {
            get: function (nameOrAbility) {
                if (nameOrAbility && typeof nameOrAbility !== 'string') {
                    // TODO: don't accept Abilities here
                    return nameOrAbility;
                }
                var name = nameOrAbility || '';
                var id = toID(nameOrAbility);
                if (window.BattleAliases && id in BattleAliases) {
                    name = BattleAliases[id];
                    id = toID(name);
                }
                if (!window.BattleAbilities)
                    window.BattleAbilities = {};
                var data = window.BattleAbilities[id];
                if (data && typeof data.exists === 'boolean')
                    return data;
                if (!data)
                    data = { exists: false };
                var ability = new Ability(id, name, data);
                window.BattleAbilities[id] = ability;
                return ability;
            },
        };
        this.species = {
            get: function (nameOrSpecies) {
                if (nameOrSpecies && typeof nameOrSpecies !== 'string') {
                    // TODO: don't accept Species' here
                    return nameOrSpecies;
                }
                var name = nameOrSpecies || '';
                var id = toID(nameOrSpecies);
                var formid = id;
                if (!window.BattlePokedexAltForms)
                    window.BattlePokedexAltForms = {};
                if (formid in window.BattlePokedexAltForms)
                    return window.BattlePokedexAltForms[formid];
                if (window.BattleAliases && id in BattleAliases) {
                    name = BattleAliases[id];
                    id = toID(name);
                }
                else if (window.BattlePokedex && !(id in BattlePokedex) && window.BattleBaseSpeciesChart) {
                    for (var _i = 0, BattleBaseSpeciesChart_1 = BattleBaseSpeciesChart; _i < BattleBaseSpeciesChart_1.length; _i++) {
                        var baseSpeciesId = BattleBaseSpeciesChart_1[_i];
                        if (formid.startsWith(baseSpeciesId)) {
                            id = baseSpeciesId;
                            break;
                        }
                    }
                }
                if (!window.BattlePokedex)
                    window.BattlePokedex = {};
                var data = window.BattlePokedex[id];
                var species;
                if (data && typeof data.exists === 'boolean') {
                    species = data;
                }
                else {
                    if (!data)
                        data = { exists: false };
                    if (!data.tier && id.slice(-5) === 'totem') {
                        data.tier = _this.species.get(id.slice(0, -5)).tier;
                    }
                    if (!data.tier && data.baseSpecies && toID(data.baseSpecies) !== id) {
                        data.tier = _this.species.get(data.baseSpecies).tier;
                    }
                    species = new Species(id, name, data);
                    window.BattlePokedex[id] = species;
                }
                if (species.cosmeticFormes) {
                    for (var _a = 0, _b = species.cosmeticFormes; _a < _b.length; _a++) {
                        var forme = _b[_a];
                        if (toID(forme) === formid) {
                            species = new Species(formid, name, __assign(__assign({}, species), { name: forme, forme: forme.slice(species.name.length + 1), baseForme: "", baseSpecies: species.name, otherFormes: null }));
                            window.BattlePokedexAltForms[formid] = species;
                            break;
                        }
                    }
                }
                return species;
            },
        };
        this.types = {
            allCache: null,
            get: function (type) {
                if (!type || typeof type === 'string') {
                    var id = toID(type);
                    var name_1 = id.substr(0, 1).toUpperCase() + id.substr(1);
                    type = (window.BattleTypeChart && window.BattleTypeChart[id]) || {};
                    if (type.damageTaken)
                        type.exists = true;
                    if (!type.id)
                        type.id = id;
                    if (!type.name)
                        type.name = name_1;
                    if (!type.effectType) {
                        type.effectType = 'Type';
                    }
                }
                return type;
            },
            all: function () {
                if (_this.types.allCache)
                    return _this.types.allCache;
                var types = [];
                for (var id in (window.BattleTypeChart || {})) {
                    types.push(Dex.types.get(id));
                }
                if (types.length)
                    _this.types.allCache = types;
                return types;
            },
            isName: function (name) {
                var id = toID(name);
                if (name !== id.substr(0, 1).toUpperCase() + id.substr(1))
                    return false;
                return (window.BattleTypeChart || {}).hasOwnProperty(id);
            },
        };
    }
    class_2.prototype.mod = function (modid) {
        if (modid === 'gen9')
            return this;
        if (!window.BattleTeambuilderTable)
            return this;
        if (modid in this.moddedDexes) {
            return this.moddedDexes[modid];
        }
        this.moddedDexes[modid] = new ModdedDex(modid);
        return this.moddedDexes[modid];
    };
    class_2.prototype.forGen = function (gen) {
        if (!gen)
            return this;
        return this.mod("gen".concat(gen));
    };
    class_2.prototype.resolveAvatar = function (avatar) {
        var _a, _b;
        if (avatar == 'tink_p1') {
            return 'https://nuzlockeshowdown.com/sprites/avatars/tink_p1.png';
        }
        if (avatar == 'tink_p2') {
            return 'https://nuzlockeshowdown.com/sprites/avatars/tink_p2.png';
        }
        if (specialAvatars.includes(avatar)) {
            return 'https://nuzlockeshowdown.com/sprites/avatars/' + avatar + '.png';
        }
        if (window.BattleAvatarNumbers && avatar in BattleAvatarNumbers) {
            avatar = BattleAvatarNumbers[avatar];
        }
        if (avatar.charAt(0) === '#') {
            return Dex.resourcePrefix + 'sprites/trainers-custom/' + toID(avatar.substr(1)) + '.png';
        }
        if (avatar.includes('.') && ((_b = (_a = window.Config) === null || _a === void 0 ? void 0 : _a.server) === null || _b === void 0 ? void 0 : _b.registered)) {
            // custom avatar served by the server
            var protocol = (Config.server.port === 443) ? 'https' : 'http';
            return protocol + '://' + Config.server.host + ':' + Config.server.port +
                '/avatars/' + encodeURIComponent(avatar).replace(/\%3F/g, '?');
        }
        return Dex.resourcePrefix + 'sprites/trainers/' + Dex.sanitizeName(avatar || 'unknown') + '.png';
    };
    /**
     * This is used to sanitize strings from data files like `moves.js` and
     * `teambuilder-tables.js`.
     *
     * This makes sure untrusted strings can't wreak havoc if someone forgets to
     * escape it before putting it in HTML.
     *
     * None of these characters belong in these files, anyway. (They can be used
     * in move descriptions, but those are served from `text.js`, which are
     * definitely always treated as unsanitized.)
     */
    class_2.prototype.sanitizeName = function (name) {
        if (!name)
            return '';
        return ('' + name)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
            .slice(0, 50);
    };
    class_2.prototype.prefs = function (prop) {
        var _a, _b;
        // @ts-ignore
        return (_b = (_a = window.Storage) === null || _a === void 0 ? void 0 : _a.prefs) === null || _b === void 0 ? void 0 : _b.call(_a, prop);
    };
    class_2.prototype.getShortName = function (name) {
        var shortName = name.replace(/[^A-Za-z0-9]+$/, '');
        if (shortName.indexOf('(') >= 0) {
            shortName += name.slice(shortName.length).replace(/[^\(\)]+/g, '').replace(/\(\)/g, '');
        }
        return shortName;
    };
    class_2.prototype.getEffect = function (name) {
        name = (name || '').trim();
        if (name.substr(0, 5) === 'item:') {
            return Dex.items.get(name.substr(5).trim());
        }
        else if (name.substr(0, 8) === 'ability:') {
            return Dex.abilities.get(name.substr(8).trim());
        }
        else if (name.substr(0, 5) === 'move:') {
            return Dex.moves.get(name.substr(5).trim());
        }
        var id = toID(name);
        return new PureEffect(id, name);
    };
    class_2.prototype.getGen3Category = function (type) {
        return [
            'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Psychic', 'Dark', 'Dragon',
        ].includes(type) ? 'Special' : 'Physical';
    };
    class_2.prototype.hasAbility = function (species, ability) {
        for (var i in species.abilities) {
            // @ts-ignore
            if (ability === species.abilities[i])
                return true;
        }
        return false;
    };
    class_2.prototype.loadSpriteData = function (gen) {
        if (this.loadedSpriteData[gen])
            return;
        this.loadedSpriteData[gen] = 1;
        var path = $('script[src*="pokedex-mini.js"]').attr('src') || '';
        var qs = '?' + (path.split('?')[1] || '');
        path = (path.match(/.+?(?=data\/pokedex-mini\.js)/) || [])[0] || '';
        var el = document.createElement('script');
        el.src = path + 'data/pokedex-mini-bw.js' + qs;
        document.getElementsByTagName('body')[0].appendChild(el);
    };
    class_2.prototype.getSpriteData = function (pokemon, isFront, options) {
        var _a, _b;
        if (options === void 0) { options = { gen: 6 }; }
        console.log('Getting dex-date to find sprite for: ' + pokemon);
        var mechanicsGen = options.gen || 6;
        var isDynamax = !!options.dynamax;
        if (pokemon instanceof Pokemon) {
            if (pokemon.volatiles.transform) {
                options.shiny = pokemon.volatiles.transform[2];
                options.gender = pokemon.volatiles.transform[3];
            }
            else {
                options.shiny = pokemon.shiny;
                options.gender = pokemon.gender;
            }
            var isGigantamax = false;
            if (pokemon.volatiles.dynamax) {
                if (pokemon.volatiles.dynamax[1]) {
                    isGigantamax = true;
                }
                else if (options.dynamax !== false) {
                    isDynamax = true;
                }
            }
            pokemon = pokemon.getSpeciesForme() + (isGigantamax ? '-Gmax' : '');
        }
        var species = Dex.species.get(pokemon);
        console.log('Getting sprite for:');
        console.log(species);
        // Gmax sprites are already extremely large, so we don't need to double.
        if (species.name.endsWith('-Gmax'))
            isDynamax = false;
        var spriteData = {
            gen: mechanicsGen,
            w: 96,
            h: 96,
            y: 0,
            url: Dex.resourcePrefix + 'sprites/',
            pixelated: true,
            isFrontSprite: false,
            cryurl: '',
            shiny: options.shiny,
        };
        var name = species.spriteid;
        var dir;
        var facing;
        if (isFront) {
            spriteData.isFrontSprite = true;
            dir = '';
            facing = 'front';
        }
        else {
            dir = '-back';
            facing = 'back';
        }
        // Decide which gen sprites to use.
        //
        // There are several different generations we care about here:
        //
        //   - mechanicsGen: the generation number of the mechanics and battle (options.gen)
        //   - graphicsGen: the generation number of sprite/field graphics the user has requested.
        //     This will default to mechanicsGen, but may be altered depending on user preferences.
        //   - spriteData.gen: the generation number of a the specific Pokemon sprite in question.
        //     This defaults to graphicsGen, but if the graphicsGen doesn't have a sprite for the Pokemon
        //     (eg. Darmanitan in graphicsGen 2) then we go up gens until it exists.
        //
        var graphicsGen = mechanicsGen;
        if (Dex.prefs('nopastgens'))
            graphicsGen = 6;
        if (Dex.prefs('bwgfx') && graphicsGen >= 6)
            graphicsGen = 5;
        spriteData.gen = Math.max(graphicsGen, Math.min(species.gen, 5));
        var baseDir = ['', 'gen1', 'gen2', 'gen3', 'gen4', 'gen5', '', '', '', ''][spriteData.gen];
        var animationData = null;
        var miscData = null;
        var speciesid = species.id;
        if (species.isTotem)
            speciesid = toID(name);
        if (baseDir === '' && window.BattlePokemonSprites) {
            animationData = BattlePokemonSprites[speciesid];
        }
        if (baseDir === 'gen5' && window.BattlePokemonSpritesBW) {
            animationData = BattlePokemonSpritesBW[speciesid];
        }
        if (window.BattlePokemonSprites)
            miscData = BattlePokemonSprites[speciesid];
        if (!miscData && window.BattlePokemonSpritesBW)
            miscData = BattlePokemonSpritesBW[speciesid];
        if (!animationData)
            animationData = {};
        if (!miscData)
            miscData = {};
        if (miscData.num !== 0 && miscData.num > -5000) {
            var baseSpeciesid = toID(species.baseSpecies);
            spriteData.cryurl = 'audio/cries/' + baseSpeciesid;
            var formeid = species.formeid;
            if (species.isMega || formeid && (formeid === '-crowned' ||
                formeid === '-eternal' ||
                formeid === '-eternamax' ||
                formeid === '-four' ||
                formeid === '-hangry' ||
                formeid === '-hero' ||
                formeid === '-lowkey' ||
                formeid === '-noice' ||
                formeid === '-primal' ||
                formeid === '-rapidstrike' ||
                formeid === '-roaming' ||
                formeid === '-school' ||
                formeid === '-sky' ||
                formeid === '-starter' ||
                formeid === '-super' ||
                formeid === '-therian' ||
                formeid === '-unbound' ||
                baseSpeciesid === 'calyrex' ||
                baseSpeciesid === 'kyurem' ||
                baseSpeciesid === 'cramorant' ||
                baseSpeciesid === 'indeedee' ||
                baseSpeciesid === 'lycanroc' ||
                baseSpeciesid === 'necrozma' ||
                baseSpeciesid === 'oinkologne' ||
                baseSpeciesid === 'oricorio' ||
                baseSpeciesid === 'slowpoke' ||
                baseSpeciesid === 'tatsugiri' ||
                baseSpeciesid === 'zygarde')) {
                spriteData.cryurl += formeid;
            }
            spriteData.cryurl += '.mp3';
        }
        if (options.shiny && mechanicsGen > 1)
            dir += '-shiny';
        // April Fool's 2014
        if (((_b = (_a = window.Config) === null || _a === void 0 ? void 0 : _a.server) === null || _b === void 0 ? void 0 : _b.afd) || Dex.prefs('afd') || options.afd) {
            dir = 'afd' + dir;
            spriteData.url += dir + '/' + name + '.png';
            // Duplicate code but needed to make AFD tinymax work
            // April Fool's 2020
            if (isDynamax && !options.noScale) {
                spriteData.w *= 0.25;
                spriteData.h *= 0.25;
                spriteData.y += -22;
            }
            else if (species.isTotem && !options.noScale) {
                spriteData.w *= 0.5;
                spriteData.h *= 0.5;
                spriteData.y += -11;
            }
            return spriteData;
        }
        // Mod Cries
        if (options.mod) {
            spriteData.cryurl = "sprites/".concat(options.mod, "/audio/").concat(toID(species.baseSpecies));
            spriteData.cryurl += '.mp3';
        }
        if (animationData[facing + 'f'] && options.gender === 'F')
            facing += 'f';
        var allowAnim = !Dex.prefs('noanim') && !Dex.prefs('nogif');
        if (allowAnim && spriteData.gen >= 6)
            spriteData.pixelated = false;
        if (allowAnim && animationData[facing] && spriteData.gen >= 5) {
            if (facing.slice(-1) === 'f')
                name += '-f';
            dir = baseDir + 'ani' + dir;
            spriteData.w = animationData[facing].w;
            spriteData.h = animationData[facing].h;
            spriteData.url += dir + '/' + name + '.gif';
        }
        else {
            // There is no entry or enough data in pokedex-mini.js
            // Handle these in case-by-case basis; either using BW sprites or matching the played gen.
            dir = (baseDir || 'gen5') + dir;
            // Gender differences don't exist prior to Gen 4,
            // so there are no sprites for it
            if (spriteData.gen >= 4 && miscData['frontf'] && options.gender === 'F') {
                name += '-f';
            }
            spriteData.url += dir + '/' + name + '.png';
            if (species.id === 'nahidwin') {
                spriteData.url = 'https://nuzlockeshowdown.com/sprites/hatIdWinv2.png';
            }
        }
        if (!options.noScale) {
            if (graphicsGen > 4) {
                // no scaling
            }
            else if (spriteData.isFrontSprite) {
                spriteData.w *= 2;
                spriteData.h *= 2;
                spriteData.y += -16;
            }
            else {
                // old gen backsprites are multiplied by 1.5x by the 3D engine
                spriteData.w *= 2 / 1.5;
                spriteData.h *= 2 / 1.5;
                spriteData.y += -11;
            }
            if (spriteData.gen <= 2)
                spriteData.y += 2;
        }
        if (isDynamax && !options.noScale) {
            spriteData.w *= 2;
            spriteData.h *= 2;
            spriteData.y += -22;
        }
        else if (species.isTotem && !options.noScale) {
            spriteData.w *= 1.5;
            spriteData.h *= 1.5;
            spriteData.y += -11;
        }
        return spriteData;
    };
    class_2.prototype.getPokemonIconNum = function (id, isFemale, facingLeft) {
        var _a, _b, _c, _d, _e;
        var num = 0;
        if ((_b = (_a = window.BattlePokemonSprites) === null || _a === void 0 ? void 0 : _a[id]) === null || _b === void 0 ? void 0 : _b.num) {
            num = BattlePokemonSprites[id].num;
        }
        else if ((_d = (_c = window.BattlePokedex) === null || _c === void 0 ? void 0 : _c[id]) === null || _d === void 0 ? void 0 : _d.num) {
            num = BattlePokedex[id].num;
        }
        if (num < 0)
            num = 0;
        if (num > 1025)
            num = 0;
        if ((_e = window.BattlePokemonIconIndexes) === null || _e === void 0 ? void 0 : _e[id]) {
            num = BattlePokemonIconIndexes[id];
        }
        if (isFemale) {
            if (['unfezant', 'frillish', 'jellicent', 'meowstic', 'pyroar'].includes(id)) {
                num = BattlePokemonIconIndexes[id + 'f'];
            }
        }
        if (facingLeft) {
            if (BattlePokemonIconIndexesLeft[id]) {
                num = BattlePokemonIconIndexesLeft[id];
            }
        }
        return num;
    };
    class_2.prototype.getPokemonIcon = function (pokemon, facingLeft) {
        var _a;
        if (pokemon === 'pokeball') {
            return "background:transparent url(".concat(Dex.resourcePrefix, "sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -0px 4px");
        }
        else if (pokemon === 'pokeball-statused') {
            return "background:transparent url(".concat(Dex.resourcePrefix, "sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -40px 4px");
        }
        else if (pokemon === 'pokeball-fainted') {
            return "background:transparent url(".concat(Dex.resourcePrefix, "sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -80px 4px;opacity:.4;filter:contrast(0)");
        }
        else if (pokemon === 'pokeball-none') {
            return "background:transparent url(".concat(Dex.resourcePrefix, "sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -80px 4px");
        }
        var id = toID(pokemon);
        if (!pokemon || typeof pokemon === 'string')
            pokemon = null;
        // @ts-ignore
        if (pokemon === null || pokemon === void 0 ? void 0 : pokemon.speciesForme)
            id = toID(pokemon.speciesForme);
        // @ts-ignore
        if (pokemon === null || pokemon === void 0 ? void 0 : pokemon.species)
            id = toID(pokemon.species);
        // @ts-ignore
        if (((_a = pokemon === null || pokemon === void 0 ? void 0 : pokemon.volatiles) === null || _a === void 0 ? void 0 : _a.formechange) && !pokemon.volatiles.transform) {
            // @ts-ignore
            id = toID(pokemon.volatiles.formechange[1]);
        }
        var num = this.getPokemonIconNum(id, (pokemon === null || pokemon === void 0 ? void 0 : pokemon.gender) === 'F', facingLeft);
        var top = Math.floor(num / 12) * 30;
        var left = (num % 12) * 40;
        var fainted = ((pokemon === null || pokemon === void 0 ? void 0 : pokemon.fainted) ? ";opacity:.3;filter:grayscale(100%) brightness(.5)" : "");
        return "background:transparent url(".concat(Dex.resourcePrefix, "sprites/pokemonicons-sheet.png?v16) no-repeat scroll -").concat(left, "px -").concat(top, "px").concat(fainted);
    };
    class_2.prototype.getTeambuilderSpriteData = function (pokemon, gen) {
        var _a, _b;
        if (gen === void 0) { gen = 0; }
        var id = toID(pokemon.species);
        var spriteid = pokemon.spriteid;
        var species = Dex.species.get(pokemon.species);
        if (pokemon.species && !spriteid) {
            spriteid = species.spriteid || toID(pokemon.species);
        }
        if (species.exists === false)
            return { spriteDir: 'sprites/gen5', spriteid: '0', x: 10, y: 5 };
        if (((_b = (_a = window.Config) === null || _a === void 0 ? void 0 : _a.server) === null || _b === void 0 ? void 0 : _b.afd) || Dex.prefs('afd')) {
            return {
                spriteid: spriteid,
                spriteDir: 'sprites/afd',
                shiny: !!pokemon.shiny,
                x: 10,
                y: 5,
            };
        }
        var spriteData = {
            spriteid: spriteid,
            spriteDir: 'sprites/dex',
            x: -2,
            y: -3,
        };
        if (pokemon.shiny)
            spriteData.shiny = true;
        if (Dex.prefs('nopastgens'))
            gen = 6;
        if (Dex.prefs('bwgfx') && gen > 5)
            gen = 5;
        var xydexExists = (!species.isNonstandard || species.isNonstandard === 'Past' || species.isNonstandard === 'CAP') || [
            "pikachustarter", "eeveestarter", "meltan", "melmetal", "pokestarufo", "pokestarufo2", "pokestarbrycenman", "pokestarmt", "pokestarmt2", "pokestargiant", "pokestarhumanoid", "pokestarmonster", "pokestarf00", "pokestarf002", "pokestarspirit",
        ].includes(species.id);
        if (species.gen === 8 && species.isNonstandard !== 'CAP')
            xydexExists = false;
        if ((!gen || gen >= 6) && xydexExists) {
            if (species.gen >= 7) {
                spriteData.x = -6;
                spriteData.y = -7;
            }
            else if (id.substr(0, 6) === 'arceus') {
                spriteData.x = -2;
                spriteData.y = 7;
            }
            else if (id === 'garchomp') {
                spriteData.x = -2;
                spriteData.y = 2;
            }
            else if (id === 'garchompmega') {
                spriteData.x = -2;
                spriteData.y = 0;
            }
            return spriteData;
        }
        spriteData.spriteDir = 'sprites/gen5';
        if (gen <= 1 && species.gen <= 1)
            spriteData.spriteDir = 'sprites/gen1';
        else if (gen <= 2 && species.gen <= 2)
            spriteData.spriteDir = 'sprites/gen2';
        else if (gen <= 3 && species.gen <= 3)
            spriteData.spriteDir = 'sprites/gen3';
        else if (gen <= 4 && species.gen <= 4)
            spriteData.spriteDir = 'sprites/gen4';
        spriteData.x = 10;
        spriteData.y = 5;
        return spriteData;
    };
    class_2.prototype.getTeambuilderSprite = function (pokemon, gen) {
        if (gen === void 0) { gen = 0; }
        if (!pokemon)
            return '';
        var data = this.getTeambuilderSpriteData(pokemon, gen);
        var shiny = (data.shiny ? '-shiny' : '');
        return 'background-image:url(' + Dex.resourcePrefix + data.spriteDir + shiny + '/' + data.spriteid + '.png);background-position:' + data.x + 'px ' + data.y + 'px;background-repeat:no-repeat';
    };
    class_2.prototype.getItemIcon = function (item) {
        var num = 0;
        if (typeof item === 'string' && exports.BattleItems)
            item = exports.BattleItems[toID(item)];
        if (item === null || item === void 0 ? void 0 : item.spritenum)
            num = item.spritenum;
        var top = Math.floor(num / 16) * 24;
        var left = (num % 16) * 24;
        return 'background:transparent url(' + Dex.resourcePrefix + 'sprites/itemicons-sheet.png?v1) no-repeat scroll -' + left + 'px -' + top + 'px';
    };
    class_2.prototype.getTypeIcon = function (type, b) {
        type = this.types.get(type).name;
        if (!type)
            type = '???';
        var sanitizedType = type.replace(/\?/g, '%3f');
        return "<img src=\"".concat(Dex.resourcePrefix, "sprites/types/").concat(sanitizedType, ".png\" alt=\"").concat(type, "\" height=\"14\" width=\"32\" class=\"pixelated").concat(b ? ' b' : '', "\" />");
    };
    class_2.prototype.getCategoryIcon = function (category) {
        var categoryID = toID(category);
        var sanitizedCategory = '';
        switch (categoryID) {
            case 'physical':
            case 'special':
            case 'status':
                sanitizedCategory = categoryID.charAt(0).toUpperCase() + categoryID.slice(1);
                break;
            default:
                sanitizedCategory = 'undefined';
                break;
        }
        return "<img src=\"".concat(Dex.resourcePrefix, "sprites/categories/").concat(sanitizedCategory, ".png\" alt=\"").concat(sanitizedCategory, "\" height=\"14\" width=\"32\" class=\"pixelated\" />");
    };
    class_2.prototype.getPokeballs = function () {
        if (this.pokeballs)
            return this.pokeballs;
        this.pokeballs = [];
        if (!window.BattleItems)
            window.BattleItems = {};
        for (var _i = 0, _a = Object.values(window.BattleItems); _i < _a.length; _i++) {
            var data = _a[_i];
            if (!data.isPokeball)
                continue;
            this.pokeballs.push(data.name);
        }
        return this.pokeballs;
    };
    return class_2;
}());
var ModdedDex = /** @class */ (function () {
    function ModdedDex(modid) {
        var _this = this;
        this.cache = {
            Moves: {},
            Items: {},
            Abilities: {},
            Species: {},
            Types: {},
        };
        this.pokeballs = null;
        this.moves = {
            get: function (name) {
                var id = toID(name);
                if (window.BattleAliases && id in BattleAliases) {
                    name = BattleAliases[id];
                    id = toID(name);
                }
                if (_this.cache.Moves.hasOwnProperty(id))
                    return _this.cache.Moves[id];
                var data = __assign({}, Dex.moves.get(name));
                for (var i = Dex.gen - 1; i >= _this.gen; i--) {
                    var table = window.BattleTeambuilderTable["gen".concat(i)];
                    if (id in table.overrideMoveData) {
                        Object.assign(data, table.overrideMoveData[id]);
                    }
                }
                if (_this.modid !== "gen".concat(_this.gen)) {
                    var table = window.BattleTeambuilderTable[_this.modid];
                    if (id in table.overrideMoveData) {
                        Object.assign(data, table.overrideMoveData[id]);
                    }
                }
                if (_this.gen <= 3 && data.category !== 'Status') {
                    data.category = Dex.getGen3Category(data.type);
                }
                var move = new Move(id, name, data);
                _this.cache.Moves[id] = move;
                return move;
            },
        };
        this.items = {
            get: function (name) {
                var id = toID(name);
                if (window.BattleAliases && id in BattleAliases) {
                    name = BattleAliases[id];
                    id = toID(name);
                }
                if (_this.cache.Items.hasOwnProperty(id))
                    return _this.cache.Items[id];
                var data = __assign({}, Dex.items.get(name));
                for (var i = _this.gen; i < 9; i++) {
                    var table = window.BattleTeambuilderTable['gen' + i];
                    if (id in table.overrideItemDesc) {
                        data.shortDesc = table.overrideItemDesc[id];
                        break;
                    }
                }
                var item = new Item(id, name, data);
                _this.cache.Items[id] = item;
                return item;
            },
        };
        this.abilities = {
            get: function (name) {
                var id = toID(name);
                if (window.BattleAliases && id in BattleAliases) {
                    name = BattleAliases[id];
                    id = toID(name);
                }
                if (_this.cache.Abilities.hasOwnProperty(id))
                    return _this.cache.Abilities[id];
                var data = __assign({}, Dex.abilities.get(name));
                for (var i = Dex.gen - 1; i >= _this.gen; i--) {
                    var table = window.BattleTeambuilderTable["gen".concat(i)];
                    if (id in table.overrideAbilityData) {
                        Object.assign(data, table.overrideAbilityData[id]);
                    }
                }
                if (_this.modid !== "gen".concat(_this.gen)) {
                    var table = window.BattleTeambuilderTable[_this.modid];
                    if (id in table.overrideAbilityData) {
                        Object.assign(data, table.overrideAbilityData[id]);
                    }
                }
                var ability = new Ability(id, name, data);
                _this.cache.Abilities[id] = ability;
                return ability;
            },
        };
        this.species = {
            get: function (name) {
                var id = toID(name);
                if (window.BattleAliases && id in BattleAliases) {
                    name = BattleAliases[id];
                    id = toID(name);
                }
                if (_this.cache.Species.hasOwnProperty(id))
                    return _this.cache.Species[id];
                var data = __assign({}, Dex.species.get(name));
                for (var i = Dex.gen - 1; i >= _this.gen; i--) {
                    var table_1 = window.BattleTeambuilderTable["gen".concat(i)];
                    if (id in table_1.overrideSpeciesData) {
                        Object.assign(data, table_1.overrideSpeciesData[id]);
                    }
                }
                if (_this.modid !== "gen".concat(_this.gen)) {
                    var table_2 = window.BattleTeambuilderTable[_this.modid];
                    if (id in table_2.overrideSpeciesData) {
                        Object.assign(data, table_2.overrideSpeciesData[id]);
                    }
                }
                if (_this.gen < 3 || _this.modid === 'gen7letsgo') {
                    data.abilities = { 0: "No Ability" };
                }
                var table = window.BattleTeambuilderTable[_this.modid];
                if (id in table.overrideTier)
                    data.tier = table.overrideTier[id];
                if (!data.tier && id.slice(-5) === 'totem') {
                    data.tier = _this.species.get(id.slice(0, -5)).tier;
                }
                if (!data.tier && data.baseSpecies && toID(data.baseSpecies) !== id) {
                    data.tier = _this.species.get(data.baseSpecies).tier;
                }
                if (data.gen > _this.gen)
                    data.tier = 'Illegal';
                var species = new Species(id, name, data);
                _this.cache.Species[id] = species;
                return species;
            },
        };
        this.types = {
            get: function (name) {
                var id = toID(name);
                name = id.substr(0, 1).toUpperCase() + id.substr(1);
                if (_this.cache.Types.hasOwnProperty(id))
                    return _this.cache.Types[id];
                var data = __assign({}, Dex.types.get(name));
                for (var i = 7; i >= _this.gen; i--) {
                    var table = window.BattleTeambuilderTable['gen' + i];
                    if (id in table.removeType) {
                        data.exists = false;
                        // don't bother correcting its attributes given it doesn't exist
                        break;
                    }
                    if (id in table.overrideTypeChart) {
                        data = __assign(__assign({}, data), table.overrideTypeChart[id]);
                    }
                }
                _this.cache.Types[id] = data;
                return data;
            },
        };
        this.modid = modid;
        var gen = parseInt(modid.substr(3, 1), 10);
        if (!modid.startsWith('gen') || !gen)
            throw new Error("Unsupported modid");
        this.gen = gen;
    }
    ModdedDex.prototype.getPokeballs = function () {
        if (this.pokeballs)
            return this.pokeballs;
        this.pokeballs = [];
        if (!window.BattleItems)
            window.BattleItems = {};
        for (var _i = 0, _a = Object.values(window.BattleItems); _i < _a.length; _i++) {
            var data = _a[_i];
            if (data.gen && data.gen > this.gen)
                continue;
            if (!data.isPokeball)
                continue;
            this.pokeballs.push(data.name);
        }
        return this.pokeballs;
    };
    return ModdedDex;
}());
var Teams = new /** @class */ (function () {
    function class_3() {
    }
    class_3.prototype.unpack = function (buf) {
        if (!buf)
            return [];
        var team = [];
        var i = 0;
        var j = 0;
        while (true) {
            var set = {};
            team.push(set);
            // name
            j = buf.indexOf('|', i);
            set.name = buf.substring(i, j);
            i = j + 1;
            // species
            j = buf.indexOf('|', i);
            set.species = Dex.species.get(buf.substring(i, j)).name || set.name;
            i = j + 1;
            // item
            j = buf.indexOf('|', i);
            set.item = Dex.items.get(buf.substring(i, j)).name;
            i = j + 1;
            // ability
            j = buf.indexOf('|', i);
            var ability = Dex.abilities.get(buf.substring(i, j)).name;
            var species = Dex.species.get(set.species);
            set.ability = (species.abilities &&
                ['', '0', '1', 'H', 'S'].includes(ability) ? species.abilities[ability || '0'] : ability);
            i = j + 1;
            // moves
            j = buf.indexOf('|', i);
            set.moves = buf.substring(i, j).split(',').map(function (moveid) {
                return Dex.moves.get(moveid).name;
            });
            i = j + 1;
            // nature
            j = buf.indexOf('|', i);
            set.nature = buf.substring(i, j);
            if (set.nature === 'undefined')
                delete set.nature;
            i = j + 1;
            // evs
            j = buf.indexOf('|', i);
            if (j !== i) {
                var evstring = buf.substring(i, j);
                if (evstring.length > 5) {
                    var evs = evstring.split(',');
                    set.evs = {
                        hp: Number(evs[0]) || 0,
                        atk: Number(evs[1]) || 0,
                        def: Number(evs[2]) || 0,
                        spa: Number(evs[3]) || 0,
                        spd: Number(evs[4]) || 0,
                        spe: Number(evs[5]) || 0,
                    };
                }
                else if (evstring === '0') {
                    set.evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
                }
            }
            i = j + 1;
            // gender
            j = buf.indexOf('|', i);
            if (i !== j)
                set.gender = buf.substring(i, j);
            i = j + 1;
            // ivs
            j = buf.indexOf('|', i);
            if (j !== i) {
                var ivs = buf.substring(i, j).split(',');
                set.ivs = {
                    hp: ivs[0] === '' ? 31 : Number(ivs[0]),
                    atk: ivs[1] === '' ? 31 : Number(ivs[1]),
                    def: ivs[2] === '' ? 31 : Number(ivs[2]),
                    spa: ivs[3] === '' ? 31 : Number(ivs[3]),
                    spd: ivs[4] === '' ? 31 : Number(ivs[4]),
                    spe: ivs[5] === '' ? 31 : Number(ivs[5]),
                };
            }
            i = j + 1;
            // shiny
            j = buf.indexOf('|', i);
            if (i !== j)
                set.shiny = true;
            i = j + 1;
            // level
            j = buf.indexOf('|', i);
            if (i !== j)
                set.level = parseInt(buf.substring(i, j), 10);
            i = j + 1;
            // happiness
            j = buf.indexOf(']', i);
            var misc = void 0;
            if (j < 0) {
                if (i < buf.length)
                    misc = buf.substring(i).split(',', 6);
            }
            else {
                if (i !== j)
                    misc = buf.substring(i, j).split(',', 6);
            }
            if (misc) {
                set.happiness = (misc[0] ? Number(misc[0]) : 255);
                set.hpType = misc[1];
                set.pokeball = misc[2];
                set.gigantamax = !!misc[3];
                set.dynamaxLevel = (misc[4] ? Number(misc[4]) : 10);
                set.teraType = misc[5];
            }
            if (j < 0)
                break;
            i = j + 1;
        }
        return team;
    };
    class_3.prototype.export = function (team, gen, hidestats) {
        var _a;
        if (hidestats === void 0) { hidestats = false; }
        if (!team)
            return '';
        if (typeof team === 'string') {
            if (team.indexOf('\n') >= 0)
                return team;
            team = this.unpack(team);
        }
        var text = '';
        for (var _i = 0, team_1 = team; _i < team_1.length; _i++) {
            var curSet = team_1[_i];
            if (curSet.name && curSet.name !== curSet.species) {
                text += '' + curSet.name + ' (' + curSet.species + ')';
            }
            else {
                text += '' + curSet.species;
            }
            if (curSet.gender === 'M')
                text += ' (M)';
            if (curSet.gender === 'F')
                text += ' (F)';
            if (curSet.item) {
                text += ' @ ' + curSet.item;
            }
            text += "  \n";
            if (curSet.ability) {
                text += 'Ability: ' + curSet.ability + "  \n";
            }
            if (curSet.level && curSet.level !== 100) {
                text += 'Level: ' + curSet.level + "  \n";
            }
            if (curSet.shiny) {
                text += 'Shiny: Yes  \n';
            }
            if (typeof curSet.happiness === 'number' && curSet.happiness !== 255 && !isNaN(curSet.happiness)) {
                text += 'Happiness: ' + curSet.happiness + "  \n";
            }
            if (curSet.pokeball) {
                text += 'Pokeball: ' + curSet.pokeball + "  \n";
            }
            if (curSet.hpType) {
                text += 'Hidden Power: ' + curSet.hpType + "  \n";
            }
            if (typeof curSet.dynamaxLevel === 'number' && curSet.dynamaxLevel !== 10 && !isNaN(curSet.dynamaxLevel)) {
                text += 'Dynamax Level: ' + curSet.dynamaxLevel + "  \n";
            }
            if (curSet.gigantamax) {
                text += 'Gigantamax: Yes  \n';
            }
            if (gen === 9) {
                var species = Dex.species.get(curSet.species);
                text += 'Tera Type: ' + (species.forceTeraType || curSet.teraType || species.types[0]) + "  \n";
            }
            if (!hidestats) {
                var first = true;
                if (curSet.evs) {
                    var j = void 0;
                    for (j in BattleStatNames) {
                        if (!curSet.evs[j])
                            continue;
                        if (first) {
                            text += 'EVs: ';
                            first = false;
                        }
                        else {
                            text += ' / ';
                        }
                        text += '' + curSet.evs[j] + ' ' + BattleStatNames[j];
                    }
                }
                if (!first) {
                    text += "  \n";
                }
                if (curSet.nature) {
                    text += '' + curSet.nature + ' Nature' + "  \n";
                }
                first = true;
                if (curSet.ivs) {
                    var defaultIvs = true;
                    var hpType = '';
                    for (var _b = 0, _c = curSet.moves; _b < _c.length; _b++) {
                        var move = _c[_b];
                        if (move.substr(0, 13) === 'Hidden Power ' && move.substr(0, 14) !== 'Hidden Power [') {
                            hpType = move.substr(13);
                            if (!Dex.types.isName(hpType)) {
                                alert(move + " is not a valid Hidden Power type.");
                                continue;
                            }
                            var stat = void 0;
                            for (stat in BattleStatNames) {
                                if ((curSet.ivs[stat] === undefined ? 31 : curSet.ivs[stat]) !== (((_a = Dex.types.get(hpType).HPivs) === null || _a === void 0 ? void 0 : _a[stat]) || 31)) {
                                    defaultIvs = false;
                                    break;
                                }
                            }
                        }
                    }
                    if (defaultIvs && !hpType) {
                        var stat = void 0;
                        for (stat in BattleStatNames) {
                            if (curSet.ivs[stat] !== 31 && curSet.ivs[stat] !== undefined) {
                                defaultIvs = false;
                                break;
                            }
                        }
                    }
                    if (!defaultIvs) {
                        var stat = void 0;
                        for (stat in BattleStatNames) {
                            if (typeof curSet.ivs[stat] === 'undefined' || isNaN(curSet.ivs[stat]) || curSet.ivs[stat] === 31)
                                continue;
                            if (first) {
                                text += 'IVs: ';
                                first = false;
                            }
                            else {
                                text += ' / ';
                            }
                            text += '' + curSet.ivs[stat] + ' ' + BattleStatNames[stat];
                        }
                    }
                }
                if (!first) {
                    text += "  \n";
                }
            }
            if (curSet.moves) {
                for (var _d = 0, _e = curSet.moves; _d < _e.length; _d++) {
                    var move = _e[_d];
                    if (move.substr(0, 13) === 'Hidden Power ') {
                        move = move.substr(0, 13) + '[' + move.substr(13) + ']';
                    }
                    if (move) {
                        text += '- ' + move + "  \n";
                    }
                }
            }
            text += "\n";
        }
        return text;
    };
    return class_3;
}());
if (typeof require === 'function') {
    // in Node
    global.Dex = Dex;
    global.toID = toID;
}
