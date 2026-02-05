import { jsx as l, Fragment as be, jsxs as b } from "react/jsx-runtime";
import * as pt from "react";
import gt, { createContext as Le, useRef as B, useLayoutEffect as Kr, useEffect as H, useId as un, useContext as Y, useInsertionEffect as hn, useMemo as ne, useCallback as D, Children as Gr, isValidElement as Yr, useState as $, Fragment as ci, createElement as Xr, forwardRef as qr, Component as Zr } from "react";
const fn = Le({});
function mn(e) {
  const t = B(null);
  return t.current === null && (t.current = e()), t.current;
}
const di = typeof window < "u", ui = di ? Kr : H, yt = /* @__PURE__ */ Le(null);
function pn(e, t) {
  e.indexOf(t) === -1 && e.push(t);
}
function gn(e, t) {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
const le = (e, t, n) => n > t ? t : n < e ? e : n;
function Ot(e, t) {
  return t ? `${e}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${t}` : e;
}
let Ve = () => {
}, ce = () => {
};
var li;
typeof process < "u" && ((li = process.env) == null ? void 0 : li.NODE_ENV) !== "production" && (Ve = (e, t, n) => {
  !e && typeof console < "u" && console.warn(Ot(t, n));
}, ce = (e, t, n) => {
  if (!e)
    throw new Error(Ot(t, n));
});
const de = {}, hi = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e);
function fi(e) {
  return typeof e == "object" && e !== null;
}
const mi = (e) => /^0[^.\s]+$/u.test(e);
// @__NO_SIDE_EFFECTS__
function yn(e) {
  let t;
  return () => (t === void 0 && (t = e()), t);
}
const te = /* @__NO_SIDE_EFFECTS__ */ (e) => e, Jr = (e, t) => (n) => t(e(n)), Ye = (...e) => e.reduce(Jr), He = /* @__NO_SIDE_EFFECTS__ */ (e, t, n) => {
  const s = t - e;
  return s === 0 ? 1 : (n - e) / s;
};
class xn {
  constructor() {
    this.subscriptions = [];
  }
  add(t) {
    return pn(this.subscriptions, t), () => gn(this.subscriptions, t);
  }
  notify(t, n, s) {
    const i = this.subscriptions.length;
    if (i)
      if (i === 1)
        this.subscriptions[0](t, n, s);
      else
        for (let a = 0; a < i; a++) {
          const r = this.subscriptions[a];
          r && r(t, n, s);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const ae = /* @__NO_SIDE_EFFECTS__ */ (e) => e * 1e3, ee = /* @__NO_SIDE_EFFECTS__ */ (e) => e / 1e3;
function pi(e, t) {
  return t ? e * (1e3 / t) : 0;
}
const _n = /* @__PURE__ */ new Set();
function vn(e, t, n) {
  e || _n.has(t) || (console.warn(Ot(t, n)), _n.add(t));
}
const gi = (e, t, n) => (((1 - 3 * n + 3 * t) * e + (3 * n - 6 * t)) * e + 3 * t) * e, Qr = 1e-7, ea = 12;
function ta(e, t, n, s, i) {
  let a, r, o = 0;
  do
    r = t + (n - t) / 2, a = gi(r, s, i) - e, a > 0 ? n = r : t = r;
  while (Math.abs(a) > Qr && ++o < ea);
  return r;
}
function Xe(e, t, n, s) {
  if (e === t && n === s)
    return te;
  const i = (a) => ta(a, 0, 1, e, n);
  return (a) => a === 0 || a === 1 ? a : gi(i(a), t, s);
}
const yi = (e) => (t) => t <= 0.5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2, xi = (e) => (t) => 1 - e(1 - t), vi = /* @__PURE__ */ Xe(0.33, 1.53, 0.69, 0.99), bn = /* @__PURE__ */ xi(vi), bi = /* @__PURE__ */ yi(bn), wi = (e) => (e *= 2) < 1 ? 0.5 * bn(e) : 0.5 * (2 - Math.pow(2, -10 * (e - 1))), wn = (e) => 1 - Math.sin(Math.acos(e)), Ni = xi(wn), Ti = yi(wn), na = /* @__PURE__ */ Xe(0.42, 0, 1, 1), sa = /* @__PURE__ */ Xe(0, 0, 0.58, 1), ki = /* @__PURE__ */ Xe(0.42, 0, 0.58, 1), ia = (e) => Array.isArray(e) && typeof e[0] != "number", Si = (e) => Array.isArray(e) && typeof e[0] == "number", Kn = {
  linear: te,
  easeIn: na,
  easeInOut: ki,
  easeOut: sa,
  circIn: wn,
  circInOut: Ti,
  circOut: Ni,
  backIn: bn,
  backInOut: bi,
  backOut: vi,
  anticipate: wi
}, ra = (e) => typeof e == "string", Gn = (e) => {
  if (Si(e)) {
    ce(e.length === 4, "Cubic bezier arrays must contain four numerical values.", "cubic-bezier-length");
    const [t, n, s, i] = e;
    return Xe(t, n, s, i);
  } else if (ra(e))
    return ce(Kn[e] !== void 0, `Invalid easing type '${e}'`, "invalid-easing-type"), Kn[e];
  return e;
}, et = [
  "setup",
  // Compute
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "preUpdate",
  // Compute
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
function aa(e, t) {
  let n = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), i = !1, a = !1;
  const r = /* @__PURE__ */ new WeakSet();
  let o = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function c(d) {
    r.has(d) && (u.schedule(d), e()), d(o);
  }
  const u = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (d, h = !1, f = !1) => {
      const p = f && i ? n : s;
      return h && r.add(d), p.has(d) || p.add(d), d;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (d) => {
      s.delete(d), r.delete(d);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (d) => {
      if (o = d, i) {
        a = !0;
        return;
      }
      i = !0, [n, s] = [s, n], n.forEach(c), n.clear(), i = !1, a && (a = !1, u.process(d));
    }
  };
  return u;
}
const oa = 40;
function Ci(e, t) {
  let n = !1, s = !0;
  const i = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, a = () => n = !0, r = et.reduce((S, v) => (S[v] = aa(a), S), {}), { setup: o, read: c, resolveKeyframes: u, preUpdate: d, update: h, preRender: f, render: m, postRender: p } = r, g = () => {
    const S = de.useManualTiming ? i.timestamp : performance.now();
    n = !1, de.useManualTiming || (i.delta = s ? 1e3 / 60 : Math.max(Math.min(S - i.timestamp, oa), 1)), i.timestamp = S, i.isProcessing = !0, o.process(i), c.process(i), u.process(i), d.process(i), h.process(i), f.process(i), m.process(i), p.process(i), i.isProcessing = !1, n && t && (s = !1, e(g));
  }, y = () => {
    n = !0, s = !0, i.isProcessing || e(g);
  };
  return { schedule: et.reduce((S, v) => {
    const x = r[v];
    return S[v] = (T, N = !1, C = !1) => (n || y(), x.schedule(T, N, C)), S;
  }, {}), cancel: (S) => {
    for (let v = 0; v < et.length; v++)
      r[et[v]].cancel(S);
  }, state: i, steps: r };
}
const { schedule: I, cancel: fe, state: K, steps: Tt } = /* @__PURE__ */ Ci(typeof requestAnimationFrame < "u" ? requestAnimationFrame : te, !0);
let it;
function la() {
  it = void 0;
}
const q = {
  now: () => (it === void 0 && q.set(K.isProcessing || de.useManualTiming ? K.timestamp : performance.now()), it),
  set: (e) => {
    it = e, queueMicrotask(la);
  }
}, Mi = (e) => (t) => typeof t == "string" && t.startsWith(e), Pi = /* @__PURE__ */ Mi("--"), ca = /* @__PURE__ */ Mi("var(--"), Nn = (e) => ca(e) ? da.test(e.split("/*")[0].trim()) : !1, da = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function Yn(e) {
  return typeof e != "string" ? !1 : e.split("/*")[0].includes("var(--");
}
const De = {
  test: (e) => typeof e == "number",
  parse: parseFloat,
  transform: (e) => e
}, Ue = {
  ...De,
  transform: (e) => le(0, 1, e)
}, tt = {
  ...De,
  default: 1
}, Oe = (e) => Math.round(e * 1e5) / 1e5, Tn = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function ua(e) {
  return e == null;
}
const ha = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, kn = (e, t) => (n) => !!(typeof n == "string" && ha.test(n) && n.startsWith(e) || t && !ua(n) && Object.prototype.hasOwnProperty.call(n, t)), Ai = (e, t, n) => (s) => {
  if (typeof s != "string")
    return s;
  const [i, a, r, o] = s.match(Tn);
  return {
    [e]: parseFloat(i),
    [t]: parseFloat(a),
    [n]: parseFloat(r),
    alpha: o !== void 0 ? parseFloat(o) : 1
  };
}, fa = (e) => le(0, 255, e), kt = {
  ...De,
  transform: (e) => Math.round(fa(e))
}, xe = {
  test: /* @__PURE__ */ kn("rgb", "red"),
  parse: /* @__PURE__ */ Ai("red", "green", "blue"),
  transform: ({ red: e, green: t, blue: n, alpha: s = 1 }) => "rgba(" + kt.transform(e) + ", " + kt.transform(t) + ", " + kt.transform(n) + ", " + Oe(Ue.transform(s)) + ")"
};
function ma(e) {
  let t = "", n = "", s = "", i = "";
  return e.length > 5 ? (t = e.substring(1, 3), n = e.substring(3, 5), s = e.substring(5, 7), i = e.substring(7, 9)) : (t = e.substring(1, 2), n = e.substring(2, 3), s = e.substring(3, 4), i = e.substring(4, 5), t += t, n += n, s += s, i += i), {
    red: parseInt(t, 16),
    green: parseInt(n, 16),
    blue: parseInt(s, 16),
    alpha: i ? parseInt(i, 16) / 255 : 1
  };
}
const zt = {
  test: /* @__PURE__ */ kn("#"),
  parse: ma,
  transform: xe.transform
}, qe = /* @__NO_SIDE_EFFECTS__ */ (e) => ({
  test: (t) => typeof t == "string" && t.endsWith(e) && t.split(" ").length === 1,
  parse: parseFloat,
  transform: (t) => `${t}${e}`
}), ue = /* @__PURE__ */ qe("deg"), oe = /* @__PURE__ */ qe("%"), A = /* @__PURE__ */ qe("px"), pa = /* @__PURE__ */ qe("vh"), ga = /* @__PURE__ */ qe("vw"), Xn = {
  ...oe,
  parse: (e) => oe.parse(e) / 100,
  transform: (e) => oe.transform(e * 100)
}, Te = {
  test: /* @__PURE__ */ kn("hsl", "hue"),
  parse: /* @__PURE__ */ Ai("hue", "saturation", "lightness"),
  transform: ({ hue: e, saturation: t, lightness: n, alpha: s = 1 }) => "hsla(" + Math.round(e) + ", " + oe.transform(Oe(t)) + ", " + oe.transform(Oe(n)) + ", " + Oe(Ue.transform(s)) + ")"
}, W = {
  test: (e) => xe.test(e) || zt.test(e) || Te.test(e),
  parse: (e) => xe.test(e) ? xe.parse(e) : Te.test(e) ? Te.parse(e) : zt.parse(e),
  transform: (e) => typeof e == "string" ? e : e.hasOwnProperty("red") ? xe.transform(e) : Te.transform(e),
  getAnimatableNone: (e) => {
    const t = W.parse(e);
    return t.alpha = 0, W.transform(t);
  }
}, ya = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function xa(e) {
  var t, n;
  return isNaN(e) && typeof e == "string" && (((t = e.match(Tn)) == null ? void 0 : t.length) || 0) + (((n = e.match(ya)) == null ? void 0 : n.length) || 0) > 0;
}
const Li = "number", Vi = "color", va = "var", ba = "var(", qn = "${}", wa = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function _e(e) {
  const t = e.toString(), n = [], s = {
    color: [],
    number: [],
    var: []
  }, i = [];
  let a = 0;
  const o = t.replace(wa, (c) => (W.test(c) ? (s.color.push(a), i.push(Vi), n.push(W.parse(c))) : c.startsWith(ba) ? (s.var.push(a), i.push(va), n.push(c)) : (s.number.push(a), i.push(Li), n.push(parseFloat(c))), ++a, qn)).split(qn);
  return { values: n, split: o, indexes: s, types: i };
}
function Di(e) {
  return _e(e).values;
}
function $i(e) {
  const { split: t, types: n } = _e(e), s = t.length;
  return (i) => {
    let a = "";
    for (let r = 0; r < s; r++)
      if (a += t[r], i[r] !== void 0) {
        const o = n[r];
        o === Li ? a += Oe(i[r]) : o === Vi ? a += W.transform(i[r]) : a += i[r];
      }
    return a;
  };
}
const Na = (e) => typeof e == "number" ? 0 : W.test(e) ? W.getAnimatableNone(e) : e;
function Ta(e) {
  const t = Di(e);
  return $i(e)(t.map(Na));
}
const me = {
  test: xa,
  parse: Di,
  createTransformer: $i,
  getAnimatableNone: Ta
};
function St(e, t, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function ka({ hue: e, saturation: t, lightness: n, alpha: s }) {
  e /= 360, t /= 100, n /= 100;
  let i = 0, a = 0, r = 0;
  if (!t)
    i = a = r = n;
  else {
    const o = n < 0.5 ? n * (1 + t) : n + t - n * t, c = 2 * n - o;
    i = St(c, o, e + 1 / 3), a = St(c, o, e), r = St(c, o, e - 1 / 3);
  }
  return {
    red: Math.round(i * 255),
    green: Math.round(a * 255),
    blue: Math.round(r * 255),
    alpha: s
  };
}
function lt(e, t) {
  return (n) => n > 0 ? t : e;
}
const O = (e, t, n) => e + (t - e) * n, Ct = (e, t, n) => {
  const s = e * e, i = n * (t * t - s) + s;
  return i < 0 ? 0 : Math.sqrt(i);
}, Sa = [zt, xe, Te], Ca = (e) => Sa.find((t) => t.test(e));
function Zn(e) {
  const t = Ca(e);
  if (Ve(!!t, `'${e}' is not an animatable color. Use the equivalent color code instead.`, "color-not-animatable"), !t)
    return !1;
  let n = t.parse(e);
  return t === Te && (n = ka(n)), n;
}
const Jn = (e, t) => {
  const n = Zn(e), s = Zn(t);
  if (!n || !s)
    return lt(e, t);
  const i = { ...n };
  return (a) => (i.red = Ct(n.red, s.red, a), i.green = Ct(n.green, s.green, a), i.blue = Ct(n.blue, s.blue, a), i.alpha = O(n.alpha, s.alpha, a), xe.transform(i));
}, Wt = /* @__PURE__ */ new Set(["none", "hidden"]);
function Ma(e, t) {
  return Wt.has(e) ? (n) => n <= 0 ? e : t : (n) => n >= 1 ? t : e;
}
function Pa(e, t) {
  return (n) => O(e, t, n);
}
function Sn(e) {
  return typeof e == "number" ? Pa : typeof e == "string" ? Nn(e) ? lt : W.test(e) ? Jn : Va : Array.isArray(e) ? Ri : typeof e == "object" ? W.test(e) ? Jn : Aa : lt;
}
function Ri(e, t) {
  const n = [...e], s = n.length, i = e.map((a, r) => Sn(a)(a, t[r]));
  return (a) => {
    for (let r = 0; r < s; r++)
      n[r] = i[r](a);
    return n;
  };
}
function Aa(e, t) {
  const n = { ...e, ...t }, s = {};
  for (const i in n)
    e[i] !== void 0 && t[i] !== void 0 && (s[i] = Sn(e[i])(e[i], t[i]));
  return (i) => {
    for (const a in s)
      n[a] = s[a](i);
    return n;
  };
}
function La(e, t) {
  const n = [], s = { color: 0, var: 0, number: 0 };
  for (let i = 0; i < t.values.length; i++) {
    const a = t.types[i], r = e.indexes[a][s[a]], o = e.values[r] ?? 0;
    n[i] = o, s[a]++;
  }
  return n;
}
const Va = (e, t) => {
  const n = me.createTransformer(t), s = _e(e), i = _e(t);
  return s.indexes.var.length === i.indexes.var.length && s.indexes.color.length === i.indexes.color.length && s.indexes.number.length >= i.indexes.number.length ? Wt.has(e) && !i.values.length || Wt.has(t) && !s.values.length ? Ma(e, t) : Ye(Ri(La(s, i), i.values), n) : (Ve(!0, `Complex values '${e}' and '${t}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`, "complex-values-different"), lt(e, t));
};
function Ei(e, t, n) {
  return typeof e == "number" && typeof t == "number" && typeof n == "number" ? O(e, t, n) : Sn(e)(e, t);
}
const Da = (e) => {
  const t = ({ timestamp: n }) => e(n);
  return {
    start: (n = !0) => I.update(t, n),
    stop: () => fe(t),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => K.isProcessing ? K.timestamp : q.now()
  };
}, Bi = (e, t, n = 10) => {
  let s = "";
  const i = Math.max(Math.round(t / n), 2);
  for (let a = 0; a < i; a++)
    s += Math.round(e(a / (i - 1)) * 1e4) / 1e4 + ", ";
  return `linear(${s.substring(0, s.length - 2)})`;
}, ct = 2e4;
function Cn(e) {
  let t = 0;
  const n = 50;
  let s = e.next(t);
  for (; !s.done && t < ct; )
    t += n, s = e.next(t);
  return t >= ct ? 1 / 0 : t;
}
function $a(e, t = 100, n) {
  const s = n({ ...e, keyframes: [0, t] }), i = Math.min(Cn(s), ct);
  return {
    type: "keyframes",
    ease: (a) => s.next(i * a).value / t,
    duration: /* @__PURE__ */ ee(i)
  };
}
const Ra = 5;
function Ii(e, t, n) {
  const s = Math.max(t - Ra, 0);
  return pi(n - e(s), t - s);
}
const F = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
}, Mt = 1e-3;
function Ea({ duration: e = F.duration, bounce: t = F.bounce, velocity: n = F.velocity, mass: s = F.mass }) {
  let i, a;
  Ve(e <= /* @__PURE__ */ ae(F.maxDuration), "Spring duration must be 10 seconds or less", "spring-duration-limit");
  let r = 1 - t;
  r = le(F.minDamping, F.maxDamping, r), e = le(F.minDuration, F.maxDuration, /* @__PURE__ */ ee(e)), r < 1 ? (i = (u) => {
    const d = u * r, h = d * e, f = d - n, m = Ht(u, r), p = Math.exp(-h);
    return Mt - f / m * p;
  }, a = (u) => {
    const h = u * r * e, f = h * n + n, m = Math.pow(r, 2) * Math.pow(u, 2) * e, p = Math.exp(-h), g = Ht(Math.pow(u, 2), r);
    return (-i(u) + Mt > 0 ? -1 : 1) * ((f - m) * p) / g;
  }) : (i = (u) => {
    const d = Math.exp(-u * e), h = (u - n) * e + 1;
    return -Mt + d * h;
  }, a = (u) => {
    const d = Math.exp(-u * e), h = (n - u) * (e * e);
    return d * h;
  });
  const o = 5 / e, c = Ia(i, a, o);
  if (e = /* @__PURE__ */ ae(e), isNaN(c))
    return {
      stiffness: F.stiffness,
      damping: F.damping,
      duration: e
    };
  {
    const u = Math.pow(c, 2) * s;
    return {
      stiffness: u,
      damping: r * 2 * Math.sqrt(s * u),
      duration: e
    };
  }
}
const Ba = 12;
function Ia(e, t, n) {
  let s = n;
  for (let i = 1; i < Ba; i++)
    s = s - e(s) / t(s);
  return s;
}
function Ht(e, t) {
  return e * Math.sqrt(1 - t * t);
}
const ja = ["duration", "bounce"], Fa = ["stiffness", "damping", "mass"];
function Qn(e, t) {
  return t.some((n) => e[n] !== void 0);
}
function Oa(e) {
  let t = {
    velocity: F.velocity,
    stiffness: F.stiffness,
    damping: F.damping,
    mass: F.mass,
    isResolvedFromDuration: !1,
    ...e
  };
  if (!Qn(e, Fa) && Qn(e, ja))
    if (e.visualDuration) {
      const n = e.visualDuration, s = 2 * Math.PI / (n * 1.2), i = s * s, a = 2 * le(0.05, 1, 1 - (e.bounce || 0)) * Math.sqrt(i);
      t = {
        ...t,
        mass: F.mass,
        stiffness: i,
        damping: a
      };
    } else {
      const n = Ea(e);
      t = {
        ...t,
        ...n,
        mass: F.mass
      }, t.isResolvedFromDuration = !0;
    }
  return t;
}
function dt(e = F.visualDuration, t = F.bounce) {
  const n = typeof e != "object" ? {
    visualDuration: e,
    keyframes: [0, 1],
    bounce: t
  } : e;
  let { restSpeed: s, restDelta: i } = n;
  const a = n.keyframes[0], r = n.keyframes[n.keyframes.length - 1], o = { done: !1, value: a }, { stiffness: c, damping: u, mass: d, duration: h, velocity: f, isResolvedFromDuration: m } = Oa({
    ...n,
    velocity: -/* @__PURE__ */ ee(n.velocity || 0)
  }), p = f || 0, g = u / (2 * Math.sqrt(c * d)), y = r - a, w = /* @__PURE__ */ ee(Math.sqrt(c / d)), k = Math.abs(y) < 5;
  s || (s = k ? F.restSpeed.granular : F.restSpeed.default), i || (i = k ? F.restDelta.granular : F.restDelta.default);
  let S;
  if (g < 1) {
    const x = Ht(w, g);
    S = (T) => {
      const N = Math.exp(-g * w * T);
      return r - N * ((p + g * w * y) / x * Math.sin(x * T) + y * Math.cos(x * T));
    };
  } else if (g === 1)
    S = (x) => r - Math.exp(-w * x) * (y + (p + w * y) * x);
  else {
    const x = w * Math.sqrt(g * g - 1);
    S = (T) => {
      const N = Math.exp(-g * w * T), C = Math.min(x * T, 300);
      return r - N * ((p + g * w * y) * Math.sinh(C) + x * y * Math.cosh(C)) / x;
    };
  }
  const v = {
    calculatedDuration: m && h || null,
    next: (x) => {
      const T = S(x);
      if (m)
        o.done = x >= h;
      else {
        let N = x === 0 ? p : 0;
        g < 1 && (N = x === 0 ? /* @__PURE__ */ ae(p) : Ii(S, x, T));
        const C = Math.abs(N) <= s, P = Math.abs(r - T) <= i;
        o.done = C && P;
      }
      return o.value = o.done ? r : T, o;
    },
    toString: () => {
      const x = Math.min(Cn(v), ct), T = Bi((N) => v.next(x * N).value, x, 30);
      return x + "ms " + T;
    },
    toTransition: () => {
    }
  };
  return v;
}
dt.applyToOptions = (e) => {
  const t = $a(e, 100, dt);
  return e.ease = t.ease, e.duration = /* @__PURE__ */ ae(t.duration), e.type = "keyframes", e;
};
function Ut({ keyframes: e, velocity: t = 0, power: n = 0.8, timeConstant: s = 325, bounceDamping: i = 10, bounceStiffness: a = 500, modifyTarget: r, min: o, max: c, restDelta: u = 0.5, restSpeed: d }) {
  const h = e[0], f = {
    done: !1,
    value: h
  }, m = (C) => o !== void 0 && C < o || c !== void 0 && C > c, p = (C) => o === void 0 ? c : c === void 0 || Math.abs(o - C) < Math.abs(c - C) ? o : c;
  let g = n * t;
  const y = h + g, w = r === void 0 ? y : r(y);
  w !== y && (g = w - h);
  const k = (C) => -g * Math.exp(-C / s), S = (C) => w + k(C), v = (C) => {
    const P = k(C), L = S(C);
    f.done = Math.abs(P) <= u, f.value = f.done ? w : L;
  };
  let x, T;
  const N = (C) => {
    m(f.value) && (x = C, T = dt({
      keyframes: [f.value, p(f.value)],
      velocity: Ii(S, C, f.value),
      // TODO: This should be passing * 1000
      damping: i,
      stiffness: a,
      restDelta: u,
      restSpeed: d
    }));
  };
  return N(0), {
    calculatedDuration: null,
    next: (C) => {
      let P = !1;
      return !T && x === void 0 && (P = !0, v(C), N(C)), x !== void 0 && C >= x ? T.next(C - x) : (!P && v(C), f);
    }
  };
}
function za(e, t, n) {
  const s = [], i = n || de.mix || Ei, a = e.length - 1;
  for (let r = 0; r < a; r++) {
    let o = i(e[r], e[r + 1]);
    if (t) {
      const c = Array.isArray(t) ? t[r] || te : t;
      o = Ye(c, o);
    }
    s.push(o);
  }
  return s;
}
function Wa(e, t, { clamp: n = !0, ease: s, mixer: i } = {}) {
  const a = e.length;
  if (ce(a === t.length, "Both input and output ranges must be the same length", "range-length"), a === 1)
    return () => t[0];
  if (a === 2 && t[0] === t[1])
    return () => t[1];
  const r = e[0] === e[1];
  e[0] > e[a - 1] && (e = [...e].reverse(), t = [...t].reverse());
  const o = za(t, s, i), c = o.length, u = (d) => {
    if (r && d < e[0])
      return t[0];
    let h = 0;
    if (c > 1)
      for (; h < e.length - 2 && !(d < e[h + 1]); h++)
        ;
    const f = /* @__PURE__ */ He(e[h], e[h + 1], d);
    return o[h](f);
  };
  return n ? (d) => u(le(e[0], e[a - 1], d)) : u;
}
function Ha(e, t) {
  const n = e[e.length - 1];
  for (let s = 1; s <= t; s++) {
    const i = /* @__PURE__ */ He(0, t, s);
    e.push(O(n, 1, i));
  }
}
function Ua(e) {
  const t = [0];
  return Ha(t, e.length - 1), t;
}
function _a(e, t) {
  return e.map((n) => n * t);
}
function Ka(e, t) {
  return e.map(() => t || ki).splice(0, e.length - 1);
}
function ke({ duration: e = 300, keyframes: t, times: n, ease: s = "easeInOut" }) {
  const i = ia(s) ? s.map(Gn) : Gn(s), a = {
    done: !1,
    value: t[0]
  }, r = _a(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    n && n.length === t.length ? n : Ua(t),
    e
  ), o = Wa(r, t, {
    ease: Array.isArray(i) ? i : Ka(t, i)
  });
  return {
    calculatedDuration: e,
    next: (c) => (a.value = o(c), a.done = c >= e, a)
  };
}
const Ga = (e) => e !== null;
function Mn(e, { repeat: t, repeatType: n = "loop" }, s, i = 1) {
  const a = e.filter(Ga), o = i < 0 || t && n !== "loop" && t % 2 === 1 ? 0 : a.length - 1;
  return !o || s === void 0 ? a[o] : s;
}
const Ya = {
  decay: Ut,
  inertia: Ut,
  tween: ke,
  keyframes: ke,
  spring: dt
};
function ji(e) {
  typeof e.type == "string" && (e.type = Ya[e.type]);
}
class Pn {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((t) => {
      this.resolve = t;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  /**
   * Allows the animation to be awaited.
   *
   * @deprecated Use `finished` instead.
   */
  then(t, n) {
    return this.finished.then(t, n);
  }
}
const Xa = (e) => e / 100;
class An extends Pn {
  constructor(t) {
    super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.stop = () => {
      var s, i;
      const { motionValue: n } = this.options;
      n && n.updatedAt !== q.now() && this.tick(q.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), (i = (s = this.options).onStop) == null || i.call(s));
    }, this.options = t, this.initAnimation(), this.play(), t.autoplay === !1 && this.pause();
  }
  initAnimation() {
    const { options: t } = this;
    ji(t);
    const { type: n = ke, repeat: s = 0, repeatDelay: i = 0, repeatType: a, velocity: r = 0 } = t;
    let { keyframes: o } = t;
    const c = n || ke;
    process.env.NODE_ENV !== "production" && c !== ke && ce(o.length <= 2, `Only two keyframes currently supported with spring and inertia animations. Trying to animate ${o}`, "spring-two-frames"), c !== ke && typeof o[0] != "number" && (this.mixKeyframes = Ye(Xa, Ei(o[0], o[1])), o = [0, 100]);
    const u = c({ ...t, keyframes: o });
    a === "mirror" && (this.mirroredGenerator = c({
      ...t,
      keyframes: [...o].reverse(),
      velocity: -r
    })), u.calculatedDuration === null && (u.calculatedDuration = Cn(u));
    const { calculatedDuration: d } = u;
    this.calculatedDuration = d, this.resolvedDuration = d + i, this.totalDuration = this.resolvedDuration * (s + 1) - i, this.generator = u;
  }
  updateTime(t) {
    const n = Math.round(t - this.startTime) * this.playbackSpeed;
    this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = n;
  }
  tick(t, n = !1) {
    const { generator: s, totalDuration: i, mixKeyframes: a, mirroredGenerator: r, resolvedDuration: o, calculatedDuration: c } = this;
    if (this.startTime === null)
      return s.next(0);
    const { delay: u = 0, keyframes: d, repeat: h, repeatType: f, repeatDelay: m, type: p, onUpdate: g, finalKeyframe: y } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, t) : this.speed < 0 && (this.startTime = Math.min(t - i / this.speed, this.startTime)), n ? this.currentTime = t : this.updateTime(t);
    const w = this.currentTime - u * (this.playbackSpeed >= 0 ? 1 : -1), k = this.playbackSpeed >= 0 ? w < 0 : w > i;
    this.currentTime = Math.max(w, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = i);
    let S = this.currentTime, v = s;
    if (h) {
      const C = Math.min(this.currentTime, i) / o;
      let P = Math.floor(C), L = C % 1;
      !L && C >= 1 && (L = 1), L === 1 && P--, P = Math.min(P, h + 1), !!(P % 2) && (f === "reverse" ? (L = 1 - L, m && (L -= m / o)) : f === "mirror" && (v = r)), S = le(0, 1, L) * o;
    }
    const x = k ? { done: !1, value: d[0] } : v.next(S);
    a && (x.value = a(x.value));
    let { done: T } = x;
    !k && c !== null && (T = this.playbackSpeed >= 0 ? this.currentTime >= i : this.currentTime <= 0);
    const N = this.holdTime === null && (this.state === "finished" || this.state === "running" && T);
    return N && p !== Ut && (x.value = Mn(d, this.options, y, this.speed)), g && g(x.value), N && this.finish(), x;
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(t, n) {
    return this.finished.then(t, n);
  }
  get duration() {
    return /* @__PURE__ */ ee(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: t = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ ee(t);
  }
  get time() {
    return /* @__PURE__ */ ee(this.currentTime);
  }
  set time(t) {
    var n;
    t = /* @__PURE__ */ ae(t), this.currentTime = t, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = t : this.driver && (this.startTime = this.driver.now() - t / this.playbackSpeed), (n = this.driver) == null || n.start(!1);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(t) {
    this.updateTime(q.now());
    const n = this.playbackSpeed !== t;
    this.playbackSpeed = t, n && (this.time = /* @__PURE__ */ ee(this.currentTime));
  }
  play() {
    var i, a;
    if (this.isStopped)
      return;
    const { driver: t = Da, startTime: n } = this.options;
    this.driver || (this.driver = t((r) => this.tick(r))), (a = (i = this.options).onPlay) == null || a.call(i);
    const s = this.driver.now();
    this.state === "finished" ? (this.updateFinished(), this.startTime = s) : this.holdTime !== null ? this.startTime = s - this.holdTime : this.startTime || (this.startTime = n ?? s), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    this.state = "paused", this.updateTime(q.now()), this.holdTime = this.currentTime;
  }
  complete() {
    this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
  }
  finish() {
    var t, n;
    this.notifyFinished(), this.teardown(), this.state = "finished", (n = (t = this.options).onComplete) == null || n.call(t);
  }
  cancel() {
    var t, n;
    this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), (n = (t = this.options).onCancel) == null || n.call(t);
  }
  teardown() {
    this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null;
  }
  stopDriver() {
    this.driver && (this.driver.stop(), this.driver = void 0);
  }
  sample(t) {
    return this.startTime = 0, this.tick(t, !0);
  }
  attachTimeline(t) {
    var n;
    return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), (n = this.driver) == null || n.stop(), t.observe(this);
  }
}
function qa(e) {
  for (let t = 1; t < e.length; t++)
    e[t] ?? (e[t] = e[t - 1]);
}
const ve = (e) => e * 180 / Math.PI, _t = (e) => {
  const t = ve(Math.atan2(e[1], e[0]));
  return Kt(t);
}, Za = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (e) => (Math.abs(e[0]) + Math.abs(e[3])) / 2,
  rotate: _t,
  rotateZ: _t,
  skewX: (e) => ve(Math.atan(e[1])),
  skewY: (e) => ve(Math.atan(e[2])),
  skew: (e) => (Math.abs(e[1]) + Math.abs(e[2])) / 2
}, Kt = (e) => (e = e % 360, e < 0 && (e += 360), e), es = _t, ts = (e) => Math.sqrt(e[0] * e[0] + e[1] * e[1]), ns = (e) => Math.sqrt(e[4] * e[4] + e[5] * e[5]), Ja = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX: ts,
  scaleY: ns,
  scale: (e) => (ts(e) + ns(e)) / 2,
  rotateX: (e) => Kt(ve(Math.atan2(e[6], e[5]))),
  rotateY: (e) => Kt(ve(Math.atan2(-e[2], e[0]))),
  rotateZ: es,
  rotate: es,
  skewX: (e) => ve(Math.atan(e[4])),
  skewY: (e) => ve(Math.atan(e[1])),
  skew: (e) => (Math.abs(e[1]) + Math.abs(e[4])) / 2
};
function Gt(e) {
  return e.includes("scale") ? 1 : 0;
}
function Yt(e, t) {
  if (!e || e === "none")
    return Gt(t);
  const n = e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let s, i;
  if (n)
    s = Ja, i = n;
  else {
    const o = e.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    s = Za, i = o;
  }
  if (!i)
    return Gt(t);
  const a = s[t], r = i[1].split(",").map(eo);
  return typeof a == "function" ? a(r) : r[a];
}
const Qa = (e, t) => {
  const { transform: n = "none" } = getComputedStyle(e);
  return Yt(n, t);
};
function eo(e) {
  return parseFloat(e.trim());
}
const $e = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
], Re = new Set($e), ss = (e) => e === De || e === A, to = /* @__PURE__ */ new Set(["x", "y", "z"]), no = $e.filter((e) => !to.has(e));
function so(e) {
  const t = [];
  return no.forEach((n) => {
    const s = e.getValue(n);
    s !== void 0 && (t.push([n, s.get()]), s.set(n.startsWith("scale") ? 1 : 0));
  }), t;
}
const he = {
  // Dimensions
  width: ({ x: e }, { paddingLeft: t = "0", paddingRight: n = "0" }) => e.max - e.min - parseFloat(t) - parseFloat(n),
  height: ({ y: e }, { paddingTop: t = "0", paddingBottom: n = "0" }) => e.max - e.min - parseFloat(t) - parseFloat(n),
  top: (e, { top: t }) => parseFloat(t),
  left: (e, { left: t }) => parseFloat(t),
  bottom: ({ y: e }, { top: t }) => parseFloat(t) + (e.max - e.min),
  right: ({ x: e }, { left: t }) => parseFloat(t) + (e.max - e.min),
  // Transform
  x: (e, { transform: t }) => Yt(t, "x"),
  y: (e, { transform: t }) => Yt(t, "y")
};
he.translateX = he.x;
he.translateY = he.y;
const we = /* @__PURE__ */ new Set();
let Xt = !1, qt = !1, Zt = !1;
function Fi() {
  if (qt) {
    const e = Array.from(we).filter((s) => s.needsMeasurement), t = new Set(e.map((s) => s.element)), n = /* @__PURE__ */ new Map();
    t.forEach((s) => {
      const i = so(s);
      i.length && (n.set(s, i), s.render());
    }), e.forEach((s) => s.measureInitialState()), t.forEach((s) => {
      s.render();
      const i = n.get(s);
      i && i.forEach(([a, r]) => {
        var o;
        (o = s.getValue(a)) == null || o.set(r);
      });
    }), e.forEach((s) => s.measureEndState()), e.forEach((s) => {
      s.suspendedScrollY !== void 0 && window.scrollTo(0, s.suspendedScrollY);
    });
  }
  qt = !1, Xt = !1, we.forEach((e) => e.complete(Zt)), we.clear();
}
function Oi() {
  we.forEach((e) => {
    e.readKeyframes(), e.needsMeasurement && (qt = !0);
  });
}
function io() {
  Zt = !0, Oi(), Fi(), Zt = !1;
}
class Ln {
  constructor(t, n, s, i, a, r = !1) {
    this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...t], this.onComplete = n, this.name = s, this.motionValue = i, this.element = a, this.isAsync = r;
  }
  scheduleResolve() {
    this.state = "scheduled", this.isAsync ? (we.add(this), Xt || (Xt = !0, I.read(Oi), I.resolveKeyframes(Fi))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, name: n, element: s, motionValue: i } = this;
    if (t[0] === null) {
      const a = i == null ? void 0 : i.get(), r = t[t.length - 1];
      if (a !== void 0)
        t[0] = a;
      else if (s && n) {
        const o = s.readValue(n, r);
        o != null && (t[0] = o);
      }
      t[0] === void 0 && (t[0] = r), i && a === void 0 && i.set(t[0]);
    }
    qa(t);
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete(t = !1) {
    this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, t), we.delete(this);
  }
  cancel() {
    this.state === "scheduled" && (we.delete(this), this.state = "pending");
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const ro = (e) => e.startsWith("--");
function ao(e, t, n) {
  ro(t) ? e.style.setProperty(t, n) : e.style[t] = n;
}
const oo = /* @__PURE__ */ yn(() => window.ScrollTimeline !== void 0), lo = {};
function co(e, t) {
  const n = /* @__PURE__ */ yn(e);
  return () => lo[t] ?? n();
}
const zi = /* @__PURE__ */ co(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), je = ([e, t, n, s]) => `cubic-bezier(${e}, ${t}, ${n}, ${s})`, is = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ je([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ je([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ je([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ je([0.33, 1.53, 0.69, 0.99])
};
function Wi(e, t) {
  if (e)
    return typeof e == "function" ? zi() ? Bi(e, t) : "ease-out" : Si(e) ? je(e) : Array.isArray(e) ? e.map((n) => Wi(n, t) || is.easeOut) : is[e];
}
function uo(e, t, n, { delay: s = 0, duration: i = 300, repeat: a = 0, repeatType: r = "loop", ease: o = "easeOut", times: c } = {}, u = void 0) {
  const d = {
    [t]: n
  };
  c && (d.offset = c);
  const h = Wi(o, i);
  Array.isArray(h) && (d.easing = h);
  const f = {
    delay: s,
    duration: i,
    easing: Array.isArray(h) ? "linear" : h,
    fill: "both",
    iterations: a + 1,
    direction: r === "reverse" ? "alternate" : "normal"
  };
  return u && (f.pseudoElement = u), e.animate(d, f);
}
function Hi(e) {
  return typeof e == "function" && "applyToOptions" in e;
}
function ho({ type: e, ...t }) {
  return Hi(e) && zi() ? e.applyToOptions(t) : (t.duration ?? (t.duration = 300), t.ease ?? (t.ease = "easeOut"), t);
}
class fo extends Pn {
  constructor(t) {
    if (super(), this.finishedTime = null, this.isStopped = !1, this.manualStartTime = null, !t)
      return;
    const { element: n, name: s, keyframes: i, pseudoElement: a, allowFlatten: r = !1, finalKeyframe: o, onComplete: c } = t;
    this.isPseudoElement = !!a, this.allowFlatten = r, this.options = t, ce(typeof t.type != "string", `Mini animate() doesn't support "type" as a string.`, "mini-spring");
    const u = ho(t);
    this.animation = uo(n, s, i, u, a), u.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
      if (this.finishedTime = this.time, !a) {
        const d = Mn(i, this.options, o, this.speed);
        this.updateMotionValue ? this.updateMotionValue(d) : ao(n, s, d), this.animation.cancel();
      }
      c == null || c(), this.notifyFinished();
    };
  }
  play() {
    this.isStopped || (this.manualStartTime = null, this.animation.play(), this.state === "finished" && this.updateFinished());
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    var t, n;
    (n = (t = this.animation).finish) == null || n.call(t);
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch {
    }
  }
  stop() {
    if (this.isStopped)
      return;
    this.isStopped = !0;
    const { state: t } = this;
    t === "idle" || t === "finished" || (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel());
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * In this method, we commit styles back to the DOM before cancelling
   * the animation.
   *
   * This is designed to be overridden by NativeAnimationExtended, which
   * will create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to also correctly calculate velocity for any subsequent animation
   * while deferring the commit until the next animation frame.
   */
  commitStyles() {
    var n, s, i;
    const t = (n = this.options) == null ? void 0 : n.element;
    !this.isPseudoElement && (t != null && t.isConnected) && ((i = (s = this.animation).commitStyles) == null || i.call(s));
  }
  get duration() {
    var n, s;
    const t = ((s = (n = this.animation.effect) == null ? void 0 : n.getComputedTiming) == null ? void 0 : s.call(n).duration) || 0;
    return /* @__PURE__ */ ee(Number(t));
  }
  get iterationDuration() {
    const { delay: t = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ ee(t);
  }
  get time() {
    return /* @__PURE__ */ ee(Number(this.animation.currentTime) || 0);
  }
  set time(t) {
    this.manualStartTime = null, this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ ae(t);
  }
  /**
   * The playback speed of the animation.
   * 1 = normal speed, 2 = double speed, 0.5 = half speed.
   */
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(t) {
    t < 0 && (this.finishedTime = null), this.animation.playbackRate = t;
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return this.manualStartTime ?? Number(this.animation.startTime);
  }
  set startTime(t) {
    this.manualStartTime = this.animation.startTime = t;
  }
  /**
   * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
   */
  attachTimeline({ timeline: t, observe: n }) {
    var s;
    return this.allowFlatten && ((s = this.animation.effect) == null || s.updateTiming({ easing: "linear" })), this.animation.onfinish = null, t && oo() ? (this.animation.timeline = t, te) : n(this);
  }
}
const Ui = {
  anticipate: wi,
  backInOut: bi,
  circInOut: Ti
};
function mo(e) {
  return e in Ui;
}
function po(e) {
  typeof e.ease == "string" && mo(e.ease) && (e.ease = Ui[e.ease]);
}
const Pt = 10;
class go extends fo {
  constructor(t) {
    po(t), ji(t), super(t), t.startTime !== void 0 && (this.startTime = t.startTime), this.options = t;
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * Rather than read committed styles back out of the DOM, we can
   * create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to calculate velocity for any subsequent animation.
   */
  updateMotionValue(t) {
    const { motionValue: n, onUpdate: s, onComplete: i, element: a, ...r } = this.options;
    if (!n)
      return;
    if (t !== void 0) {
      n.set(t);
      return;
    }
    const o = new An({
      ...r,
      autoplay: !1
    }), c = Math.max(Pt, q.now() - this.startTime), u = le(0, Pt, c - Pt);
    n.setWithVelocity(o.sample(Math.max(0, c - u)).value, o.sample(c).value, u), o.stop();
  }
}
const rs = (e, t) => t === "zIndex" ? !1 : !!(typeof e == "number" || Array.isArray(e) || typeof e == "string" && // It's animatable if we have a string
(me.test(e) || e === "0") && // And it contains numbers and/or colors
!e.startsWith("url("));
function yo(e) {
  const t = e[0];
  if (e.length === 1)
    return !0;
  for (let n = 0; n < e.length; n++)
    if (e[n] !== t)
      return !0;
}
function xo(e, t, n, s) {
  const i = e[0];
  if (i === null)
    return !1;
  if (t === "display" || t === "visibility")
    return !0;
  const a = e[e.length - 1], r = rs(i, t), o = rs(a, t);
  return Ve(r === o, `You are trying to animate ${t} from "${i}" to "${a}". "${r ? a : i}" is not an animatable value.`, "value-not-animatable"), !r || !o ? !1 : yo(e) || (n === "spring" || Hi(n)) && s;
}
function Jt(e) {
  e.duration = 0, e.type = "keyframes";
}
const vo = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Could be re-enabled now we have support for linear() easing
  // "background-color"
]), bo = /* @__PURE__ */ yn(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function wo(e) {
  var d;
  const { motionValue: t, name: n, repeatDelay: s, repeatType: i, damping: a, type: r } = e;
  if (!(((d = t == null ? void 0 : t.owner) == null ? void 0 : d.current) instanceof HTMLElement))
    return !1;
  const { onUpdate: c, transformTemplate: u } = t.owner.getProps();
  return bo() && n && vo.has(n) && (n !== "transform" || !u) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !c && !s && i !== "mirror" && a !== 0 && r !== "inertia";
}
const No = 40;
class To extends Pn {
  constructor({ autoplay: t = !0, delay: n = 0, type: s = "keyframes", repeat: i = 0, repeatDelay: a = 0, repeatType: r = "loop", keyframes: o, name: c, motionValue: u, element: d, ...h }) {
    var p;
    super(), this.stop = () => {
      var g, y;
      this._animation && (this._animation.stop(), (g = this.stopTimeline) == null || g.call(this)), (y = this.keyframeResolver) == null || y.cancel();
    }, this.createdAt = q.now();
    const f = {
      autoplay: t,
      delay: n,
      type: s,
      repeat: i,
      repeatDelay: a,
      repeatType: r,
      name: c,
      motionValue: u,
      element: d,
      ...h
    }, m = (d == null ? void 0 : d.KeyframeResolver) || Ln;
    this.keyframeResolver = new m(o, (g, y, w) => this.onKeyframesResolved(g, y, f, !w), c, u, d), (p = this.keyframeResolver) == null || p.scheduleResolve();
  }
  onKeyframesResolved(t, n, s, i) {
    var y, w;
    this.keyframeResolver = void 0;
    const { name: a, type: r, velocity: o, delay: c, isHandoff: u, onUpdate: d } = s;
    this.resolvedAt = q.now(), xo(t, a, r, o) || ((de.instantAnimations || !c) && (d == null || d(Mn(t, s, n))), t[0] = t[t.length - 1], Jt(s), s.repeat = 0);
    const f = {
      startTime: i ? this.resolvedAt ? this.resolvedAt - this.createdAt > No ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
      finalKeyframe: n,
      ...s,
      keyframes: t
    }, m = !u && wo(f), p = (w = (y = f.motionValue) == null ? void 0 : y.owner) == null ? void 0 : w.current, g = m ? new go({
      ...f,
      element: p
    }) : new An(f);
    g.finished.then(() => {
      this.notifyFinished();
    }).catch(te), this.pendingTimeline && (this.stopTimeline = g.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = g;
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(t, n) {
    return this.finished.finally(t).then(() => {
    });
  }
  get animation() {
    var t;
    return this._animation || ((t = this.keyframeResolver) == null || t.resume(), io()), this._animation;
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(t) {
    this.animation.time = t;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(t) {
    this.animation.speed = t;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(t) {
    return this._animation ? this.stopTimeline = this.animation.attachTimeline(t) : this.pendingTimeline = t, () => this.stop();
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    var t;
    this._animation && this.animation.cancel(), (t = this.keyframeResolver) == null || t.cancel();
  }
}
function _i(e, t, n, s = 0, i = 1) {
  const a = Array.from(e).sort((u, d) => u.sortNodePosition(d)).indexOf(t), r = e.size, o = (r - 1) * s;
  return typeof n == "function" ? n(a, r) : i === 1 ? a * s : o - a * s;
}
const ko = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function So(e) {
  const t = ko.exec(e);
  if (!t)
    return [,];
  const [, n, s, i] = t;
  return [`--${n ?? s}`, i];
}
const Co = 4;
function Ki(e, t, n = 1) {
  ce(n <= Co, `Max CSS variable fallback depth detected in property "${e}". This may indicate a circular fallback dependency.`, "max-css-var-depth");
  const [s, i] = So(e);
  if (!s)
    return;
  const a = window.getComputedStyle(t).getPropertyValue(s);
  if (a) {
    const r = a.trim();
    return hi(r) ? parseFloat(r) : r;
  }
  return Nn(i) ? Ki(i, t, n + 1) : i;
}
const Mo = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, Po = (e) => ({
  type: "spring",
  stiffness: 550,
  damping: e === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), Ao = {
  type: "keyframes",
  duration: 0.8
}, Lo = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, Vo = (e, { keyframes: t }) => t.length > 2 ? Ao : Re.has(e) ? e.startsWith("scale") ? Po(t[1]) : Mo : Lo, Do = (e) => e !== null;
function $o(e, { repeat: t, repeatType: n = "loop" }, s) {
  const i = e.filter(Do), a = t && n !== "loop" && t % 2 === 1 ? 0 : i.length - 1;
  return i[a];
}
function Vn(e, t) {
  return (e == null ? void 0 : e[t]) ?? (e == null ? void 0 : e.default) ?? e;
}
function Ro({ when: e, delay: t, delayChildren: n, staggerChildren: s, staggerDirection: i, repeat: a, repeatType: r, repeatDelay: o, from: c, elapsed: u, ...d }) {
  return !!Object.keys(d).length;
}
const Dn = (e, t, n, s = {}, i, a) => (r) => {
  const o = Vn(s, e) || {}, c = o.delay || s.delay || 0;
  let { elapsed: u = 0 } = s;
  u = u - /* @__PURE__ */ ae(c);
  const d = {
    keyframes: Array.isArray(n) ? n : [null, n],
    ease: "easeOut",
    velocity: t.getVelocity(),
    ...o,
    delay: -u,
    onUpdate: (f) => {
      t.set(f), o.onUpdate && o.onUpdate(f);
    },
    onComplete: () => {
      r(), o.onComplete && o.onComplete();
    },
    name: e,
    motionValue: t,
    element: a ? void 0 : i
  };
  Ro(o) || Object.assign(d, Vo(e, d)), d.duration && (d.duration = /* @__PURE__ */ ae(d.duration)), d.repeatDelay && (d.repeatDelay = /* @__PURE__ */ ae(d.repeatDelay)), d.from !== void 0 && (d.keyframes[0] = d.from);
  let h = !1;
  if ((d.type === !1 || d.duration === 0 && !d.repeatDelay) && (Jt(d), d.delay === 0 && (h = !0)), (de.instantAnimations || de.skipAnimations || i != null && i.shouldSkipAnimations) && (h = !0, Jt(d), d.delay = 0), d.allowFlatten = !o.type && !o.ease, h && !a && t.get() !== void 0) {
    const f = $o(d.keyframes, o);
    if (f !== void 0) {
      I.update(() => {
        d.onUpdate(f), d.onComplete();
      });
      return;
    }
  }
  return o.isSync ? new An(d) : new To(d);
};
function as(e) {
  const t = [{}, {}];
  return e == null || e.values.forEach((n, s) => {
    t[0][s] = n.get(), t[1][s] = n.getVelocity();
  }), t;
}
function $n(e, t, n, s) {
  if (typeof t == "function") {
    const [i, a] = as(s);
    t = t(n !== void 0 ? n : e.custom, i, a);
  }
  if (typeof t == "string" && (t = e.variants && e.variants[t]), typeof t == "function") {
    const [i, a] = as(s);
    t = t(n !== void 0 ? n : e.custom, i, a);
  }
  return t;
}
function Pe(e, t, n) {
  const s = e.getProps();
  return $n(s, t, n !== void 0 ? n : s.custom, e);
}
const Gi = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...$e
]), os = 30, Eo = (e) => !isNaN(parseFloat(e));
class Bo {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(t, n = {}) {
    this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (s) => {
      var a;
      const i = q.now();
      if (this.updatedAt !== i && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(s), this.current !== this.prev && ((a = this.events.change) == null || a.notify(this.current), this.dependents))
        for (const r of this.dependents)
          r.dirty();
    }, this.hasAnimated = !1, this.setCurrent(t), this.owner = n.owner;
  }
  setCurrent(t) {
    this.current = t, this.updatedAt = q.now(), this.canTrackVelocity === null && t !== void 0 && (this.canTrackVelocity = Eo(this.current));
  }
  setPrevFrameValue(t = this.current) {
    this.prevFrameValue = t, this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(t) {
    return process.env.NODE_ENV !== "production" && vn(!1, 'value.onChange(callback) is deprecated. Switch to value.on("change", callback).'), this.on("change", t);
  }
  on(t, n) {
    this.events[t] || (this.events[t] = new xn());
    const s = this.events[t].add(n);
    return t === "change" ? () => {
      s(), I.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : s;
  }
  clearListeners() {
    for (const t in this.events)
      this.events[t].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(t, n) {
    this.passiveEffect = t, this.stopPassiveEffect = n;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(t) {
    this.passiveEffect ? this.passiveEffect(t, this.updateAndNotify) : this.updateAndNotify(t);
  }
  setWithVelocity(t, n, s) {
    this.set(n), this.prev = void 0, this.prevFrameValue = t, this.prevUpdatedAt = this.updatedAt - s;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(t, n = !0) {
    this.updateAndNotify(t), this.prev = t, this.prevUpdatedAt = this.prevFrameValue = void 0, n && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  dirty() {
    var t;
    (t = this.events.change) == null || t.notify(this.current);
  }
  addDependent(t) {
    this.dependents || (this.dependents = /* @__PURE__ */ new Set()), this.dependents.add(t);
  }
  removeDependent(t) {
    this.dependents && this.dependents.delete(t);
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const t = q.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || t - this.updatedAt > os)
      return 0;
    const n = Math.min(this.updatedAt - this.prevUpdatedAt, os);
    return pi(parseFloat(this.current) - parseFloat(this.prevFrameValue), n);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   */
  start(t) {
    return this.stop(), new Promise((n) => {
      this.hasAnimated = !0, this.animation = t(n), this.events.animationStart && this.events.animationStart.notify();
    }).then(() => {
      this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    var t, n;
    (t = this.dependents) == null || t.clear(), (n = this.events.destroy) == null || n.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function Ae(e, t) {
  return new Bo(e, t);
}
const Qt = (e) => Array.isArray(e);
function Io(e, t, n) {
  e.hasValue(t) ? e.getValue(t).set(n) : e.addValue(t, Ae(n));
}
function jo(e) {
  return Qt(e) ? e[e.length - 1] || 0 : e;
}
function Fo(e, t) {
  const n = Pe(e, t);
  let { transitionEnd: s = {}, transition: i = {}, ...a } = n || {};
  a = { ...a, ...s };
  for (const r in a) {
    const o = jo(a[r]);
    Io(e, r, o);
  }
}
const X = (e) => !!(e && e.getVelocity);
function Oo(e) {
  return !!(X(e) && e.add);
}
function en(e, t) {
  const n = e.getValue("willChange");
  if (Oo(n))
    return n.add(t);
  if (!n && de.WillChange) {
    const s = new de.WillChange("auto");
    e.addValue("willChange", s), s.add(t);
  }
}
function Rn(e) {
  return e.replace(/([A-Z])/g, (t) => `-${t.toLowerCase()}`);
}
const zo = "framerAppearId", Yi = "data-" + Rn(zo);
function Xi(e) {
  return e.props[Yi];
}
function Wo({ protectedKeys: e, needsAnimating: t }, n) {
  const s = e.hasOwnProperty(n) && t[n] !== !0;
  return t[n] = !1, s;
}
function qi(e, t, { delay: n = 0, transitionOverride: s, type: i } = {}) {
  let { transition: a = e.getDefaultTransition(), transitionEnd: r, ...o } = t;
  const c = a == null ? void 0 : a.reduceMotion;
  s && (a = s);
  const u = [], d = i && e.animationState && e.animationState.getState()[i];
  for (const h in o) {
    const f = e.getValue(h, e.latestValues[h] ?? null), m = o[h];
    if (m === void 0 || d && Wo(d, h))
      continue;
    const p = {
      delay: n,
      ...Vn(a || {}, h)
    }, g = f.get();
    if (g !== void 0 && !f.isAnimating && !Array.isArray(m) && m === g && !p.velocity)
      continue;
    let y = !1;
    if (window.MotionHandoffAnimation) {
      const S = Xi(e);
      if (S) {
        const v = window.MotionHandoffAnimation(S, h, I);
        v !== null && (p.startTime = v, y = !0);
      }
    }
    en(e, h);
    const w = c ?? e.shouldReduceMotion;
    f.start(Dn(h, f, m, w && Gi.has(h) ? { type: !1 } : p, e, y));
    const k = f.animation;
    k && u.push(k);
  }
  return r && Promise.all(u).then(() => {
    I.update(() => {
      r && Fo(e, r);
    });
  }), u;
}
function tn(e, t, n = {}) {
  var c;
  const s = Pe(e, t, n.type === "exit" ? (c = e.presenceContext) == null ? void 0 : c.custom : void 0);
  let { transition: i = e.getDefaultTransition() || {} } = s || {};
  n.transitionOverride && (i = n.transitionOverride);
  const a = s ? () => Promise.all(qi(e, s, n)) : () => Promise.resolve(), r = e.variantChildren && e.variantChildren.size ? (u = 0) => {
    const { delayChildren: d = 0, staggerChildren: h, staggerDirection: f } = i;
    return Ho(e, t, u, d, h, f, n);
  } : () => Promise.resolve(), { when: o } = i;
  if (o) {
    const [u, d] = o === "beforeChildren" ? [a, r] : [r, a];
    return u().then(() => d());
  } else
    return Promise.all([a(), r(n.delay)]);
}
function Ho(e, t, n = 0, s = 0, i = 0, a = 1, r) {
  const o = [];
  for (const c of e.variantChildren)
    c.notify("AnimationStart", t), o.push(tn(c, t, {
      ...r,
      delay: n + (typeof s == "function" ? 0 : s) + _i(e.variantChildren, c, s, i, a)
    }).then(() => c.notify("AnimationComplete", t)));
  return Promise.all(o);
}
function Uo(e, t, n = {}) {
  e.notify("AnimationStart", t);
  let s;
  if (Array.isArray(t)) {
    const i = t.map((a) => tn(e, a, n));
    s = Promise.all(i);
  } else if (typeof t == "string")
    s = tn(e, t, n);
  else {
    const i = typeof t == "function" ? Pe(e, t, n.custom) : t;
    s = Promise.all(qi(e, i, n));
  }
  return s.then(() => {
    e.notify("AnimationComplete", t);
  });
}
const _o = {
  test: (e) => e === "auto",
  parse: (e) => e
}, Zi = (e) => (t) => t.test(e), Ji = [De, A, oe, ue, ga, pa, _o], ls = (e) => Ji.find(Zi(e));
function Ko(e) {
  return typeof e == "number" ? e === 0 : e !== null ? e === "none" || e === "0" || mi(e) : !0;
}
const Go = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function Yo(e) {
  const [t, n] = e.slice(0, -1).split("(");
  if (t === "drop-shadow")
    return e;
  const [s] = n.match(Tn) || [];
  if (!s)
    return e;
  const i = n.replace(s, "");
  let a = Go.has(t) ? 1 : 0;
  return s !== n && (a *= 100), t + "(" + a + i + ")";
}
const Xo = /\b([a-z-]*)\(.*?\)/gu, nn = {
  ...me,
  getAnimatableNone: (e) => {
    const t = e.match(Xo);
    return t ? t.map(Yo).join(" ") : e;
  }
}, cs = {
  ...De,
  transform: Math.round
}, qo = {
  rotate: ue,
  rotateX: ue,
  rotateY: ue,
  rotateZ: ue,
  scale: tt,
  scaleX: tt,
  scaleY: tt,
  scaleZ: tt,
  skew: ue,
  skewX: ue,
  skewY: ue,
  distance: A,
  translateX: A,
  translateY: A,
  translateZ: A,
  x: A,
  y: A,
  z: A,
  perspective: A,
  transformPerspective: A,
  opacity: Ue,
  originX: Xn,
  originY: Xn,
  originZ: A
}, En = {
  // Border props
  borderWidth: A,
  borderTopWidth: A,
  borderRightWidth: A,
  borderBottomWidth: A,
  borderLeftWidth: A,
  borderRadius: A,
  borderTopLeftRadius: A,
  borderTopRightRadius: A,
  borderBottomRightRadius: A,
  borderBottomLeftRadius: A,
  // Positioning props
  width: A,
  maxWidth: A,
  height: A,
  maxHeight: A,
  top: A,
  right: A,
  bottom: A,
  left: A,
  inset: A,
  insetBlock: A,
  insetBlockStart: A,
  insetBlockEnd: A,
  insetInline: A,
  insetInlineStart: A,
  insetInlineEnd: A,
  // Spacing props
  padding: A,
  paddingTop: A,
  paddingRight: A,
  paddingBottom: A,
  paddingLeft: A,
  paddingBlock: A,
  paddingBlockStart: A,
  paddingBlockEnd: A,
  paddingInline: A,
  paddingInlineStart: A,
  paddingInlineEnd: A,
  margin: A,
  marginTop: A,
  marginRight: A,
  marginBottom: A,
  marginLeft: A,
  marginBlock: A,
  marginBlockStart: A,
  marginBlockEnd: A,
  marginInline: A,
  marginInlineStart: A,
  marginInlineEnd: A,
  // Typography
  fontSize: A,
  // Misc
  backgroundPositionX: A,
  backgroundPositionY: A,
  ...qo,
  zIndex: cs,
  // SVG
  fillOpacity: Ue,
  strokeOpacity: Ue,
  numOctaves: cs
}, Zo = {
  ...En,
  // Color props
  color: W,
  backgroundColor: W,
  outlineColor: W,
  fill: W,
  stroke: W,
  // Border props
  borderColor: W,
  borderTopColor: W,
  borderRightColor: W,
  borderBottomColor: W,
  borderLeftColor: W,
  filter: nn,
  WebkitFilter: nn
}, Qi = (e) => Zo[e];
function er(e, t) {
  let n = Qi(e);
  return n !== nn && (n = me), n.getAnimatableNone ? n.getAnimatableNone(t) : void 0;
}
const Jo = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function Qo(e, t, n) {
  let s = 0, i;
  for (; s < e.length && !i; ) {
    const a = e[s];
    typeof a == "string" && !Jo.has(a) && _e(a).values.length && (i = e[s]), s++;
  }
  if (i && n)
    for (const a of t)
      e[a] = er(n, i);
}
class el extends Ln {
  constructor(t, n, s, i, a) {
    super(t, n, s, i, a, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, element: n, name: s } = this;
    if (!n || !n.current)
      return;
    super.readKeyframes();
    for (let d = 0; d < t.length; d++) {
      let h = t[d];
      if (typeof h == "string" && (h = h.trim(), Nn(h))) {
        const f = Ki(h, n.current);
        f !== void 0 && (t[d] = f), d === t.length - 1 && (this.finalKeyframe = h);
      }
    }
    if (this.resolveNoneKeyframes(), !Gi.has(s) || t.length !== 2)
      return;
    const [i, a] = t, r = ls(i), o = ls(a), c = Yn(i), u = Yn(a);
    if (c !== u && he[s]) {
      this.needsMeasurement = !0;
      return;
    }
    if (r !== o)
      if (ss(r) && ss(o))
        for (let d = 0; d < t.length; d++) {
          const h = t[d];
          typeof h == "string" && (t[d] = parseFloat(h));
        }
      else he[s] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: t, name: n } = this, s = [];
    for (let i = 0; i < t.length; i++)
      (t[i] === null || Ko(t[i])) && s.push(i);
    s.length && Qo(t, s, n);
  }
  measureInitialState() {
    const { element: t, unresolvedKeyframes: n, name: s } = this;
    if (!t || !t.current)
      return;
    s === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = he[s](t.measureViewportBox(), window.getComputedStyle(t.current)), n[0] = this.measuredOrigin;
    const i = n[n.length - 1];
    i !== void 0 && t.getValue(s, i).jump(i, !1);
  }
  measureEndState() {
    var o;
    const { element: t, name: n, unresolvedKeyframes: s } = this;
    if (!t || !t.current)
      return;
    const i = t.getValue(n);
    i && i.jump(this.measuredOrigin, !1);
    const a = s.length - 1, r = s[a];
    s[a] = he[n](t.measureViewportBox(), window.getComputedStyle(t.current)), r !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = r), (o = this.removedTransforms) != null && o.length && this.removedTransforms.forEach(([c, u]) => {
      t.getValue(c).set(u);
    }), this.resolveNoneKeyframes();
  }
}
function tl(e, t, n) {
  if (e == null)
    return [];
  if (e instanceof EventTarget)
    return [e];
  if (typeof e == "string") {
    let s = document;
    const i = (n == null ? void 0 : n[e]) ?? s.querySelectorAll(e);
    return i ? Array.from(i) : [];
  }
  return Array.from(e).filter((s) => s != null);
}
const tr = (e, t) => t && typeof e == "number" ? t.transform(e) : e;
function sn(e) {
  return fi(e) && "offsetHeight" in e;
}
const { schedule: Bn } = /* @__PURE__ */ Ci(queueMicrotask, !1), re = {
  x: !1,
  y: !1
};
function nr() {
  return re.x || re.y;
}
function nl(e) {
  return e === "x" || e === "y" ? re[e] ? null : (re[e] = !0, () => {
    re[e] = !1;
  }) : re.x || re.y ? null : (re.x = re.y = !0, () => {
    re.x = re.y = !1;
  });
}
function sr(e, t) {
  const n = tl(e), s = new AbortController(), i = {
    passive: !0,
    ...t,
    signal: s.signal
  };
  return [n, i, () => s.abort()];
}
function ds(e) {
  return !(e.pointerType === "touch" || nr());
}
function sl(e, t, n = {}) {
  const [s, i, a] = sr(e, n), r = (o) => {
    if (!ds(o))
      return;
    const { target: c } = o, u = t(c, o);
    if (typeof u != "function" || !c)
      return;
    const d = (h) => {
      ds(h) && (u(h), c.removeEventListener("pointerleave", d));
    };
    c.addEventListener("pointerleave", d, i);
  };
  return s.forEach((o) => {
    o.addEventListener("pointerenter", r, i);
  }), a;
}
const ir = (e, t) => t ? e === t ? !0 : ir(e, t.parentElement) : !1, In = (e) => e.pointerType === "mouse" ? typeof e.button != "number" || e.button <= 0 : e.isPrimary !== !1, il = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function rl(e) {
  return il.has(e.tagName) || e.isContentEditable === !0;
}
const al = /* @__PURE__ */ new Set(["INPUT", "SELECT", "TEXTAREA"]);
function ol(e) {
  return al.has(e.tagName) || e.isContentEditable === !0;
}
const rt = /* @__PURE__ */ new WeakSet();
function us(e) {
  return (t) => {
    t.key === "Enter" && e(t);
  };
}
function At(e, t) {
  e.dispatchEvent(new PointerEvent("pointer" + t, { isPrimary: !0, bubbles: !0 }));
}
const ll = (e, t) => {
  const n = e.currentTarget;
  if (!n)
    return;
  const s = us(() => {
    if (rt.has(n))
      return;
    At(n, "down");
    const i = us(() => {
      At(n, "up");
    }), a = () => At(n, "cancel");
    n.addEventListener("keyup", i, t), n.addEventListener("blur", a, t);
  });
  n.addEventListener("keydown", s, t), n.addEventListener("blur", () => n.removeEventListener("keydown", s), t);
};
function hs(e) {
  return In(e) && !nr();
}
function cl(e, t, n = {}) {
  const [s, i, a] = sr(e, n), r = (o) => {
    const c = o.currentTarget;
    if (!hs(o))
      return;
    rt.add(c);
    const u = t(c, o), d = (m, p) => {
      window.removeEventListener("pointerup", h), window.removeEventListener("pointercancel", f), rt.has(c) && rt.delete(c), hs(m) && typeof u == "function" && u(m, { success: p });
    }, h = (m) => {
      d(m, c === window || c === document || n.useGlobalTarget || ir(c, m.target));
    }, f = (m) => {
      d(m, !1);
    };
    window.addEventListener("pointerup", h, i), window.addEventListener("pointercancel", f, i);
  };
  return s.forEach((o) => {
    (n.useGlobalTarget ? window : o).addEventListener("pointerdown", r, i), sn(o) && (o.addEventListener("focus", (u) => ll(u, i)), !rl(o) && !o.hasAttribute("tabindex") && (o.tabIndex = 0));
  }), a;
}
function rr(e) {
  return fi(e) && "ownerSVGElement" in e;
}
function dl(e) {
  return rr(e) && e.tagName === "svg";
}
const ul = [...Ji, W, me], hl = (e) => ul.find(Zi(e)), fs = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), Se = () => ({
  x: fs(),
  y: fs()
}), ms = () => ({ min: 0, max: 0 }), U = () => ({
  x: ms(),
  y: ms()
}), rn = { current: null }, ar = { current: !1 }, fl = typeof window < "u";
function ml() {
  if (ar.current = !0, !!fl)
    if (window.matchMedia) {
      const e = window.matchMedia("(prefers-reduced-motion)"), t = () => rn.current = e.matches;
      e.addEventListener("change", t), t();
    } else
      rn.current = !1;
}
const pl = /* @__PURE__ */ new WeakMap();
function xt(e) {
  return e !== null && typeof e == "object" && typeof e.start == "function";
}
function Ke(e) {
  return typeof e == "string" || Array.isArray(e);
}
const jn = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], Fn = ["initial", ...jn];
function vt(e) {
  return xt(e.animate) || Fn.some((t) => Ke(e[t]));
}
function or(e) {
  return !!(vt(e) || e.variants);
}
function gl(e, t, n) {
  for (const s in t) {
    const i = t[s], a = n[s];
    if (X(i))
      e.addValue(s, i);
    else if (X(a))
      e.addValue(s, Ae(i, { owner: e }));
    else if (a !== i)
      if (e.hasValue(s)) {
        const r = e.getValue(s);
        r.liveStyle === !0 ? r.jump(i) : r.hasAnimated || r.set(i);
      } else {
        const r = e.getStaticValue(s);
        e.addValue(s, Ae(r !== void 0 ? r : i, { owner: e }));
      }
  }
  for (const s in n)
    t[s] === void 0 && e.removeValue(s);
  return t;
}
const ps = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
let ut = {};
function lr(e) {
  ut = e;
}
function yl() {
  return ut;
}
class xl {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(t, n, s) {
    return {};
  }
  constructor({ parent: t, props: n, presenceContext: s, reducedMotionConfig: i, skipAnimations: a, blockInitialAnimation: r, visualState: o }, c = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.shouldSkipAnimations = !1, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = Ln, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const m = q.now();
      this.renderScheduledAt < m && (this.renderScheduledAt = m, I.render(this.render, !1, !0));
    };
    const { latestValues: u, renderState: d } = o;
    this.latestValues = u, this.baseTarget = { ...u }, this.initialValues = n.initial ? { ...u } : {}, this.renderState = d, this.parent = t, this.props = n, this.presenceContext = s, this.depth = t ? t.depth + 1 : 0, this.reducedMotionConfig = i, this.skipAnimationsConfig = a, this.options = c, this.blockInitialAnimation = !!r, this.isControllingVariants = vt(n), this.isVariantNode = or(n), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(t && t.current);
    const { willChange: h, ...f } = this.scrapeMotionValuesFromProps(n, {}, this);
    for (const m in f) {
      const p = f[m];
      u[m] !== void 0 && X(p) && p.set(u[m]);
    }
  }
  mount(t) {
    var n;
    this.current = t, pl.set(t, this), this.projection && !this.projection.instance && this.projection.mount(t), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((s, i) => this.bindToMotionValue(i, s)), this.reducedMotionConfig === "never" ? this.shouldReduceMotion = !1 : this.reducedMotionConfig === "always" ? this.shouldReduceMotion = !0 : (ar.current || ml(), this.shouldReduceMotion = rn.current), process.env.NODE_ENV !== "production" && vn(this.shouldReduceMotion !== !0, "You have Reduced Motion enabled on your device. Animations may not appear as expected.", "reduced-motion-disabled"), this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1, (n = this.parent) == null || n.addChild(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    var t;
    this.projection && this.projection.unmount(), fe(this.notifyUpdate), fe(this.render), this.valueSubscriptions.forEach((n) => n()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), (t = this.parent) == null || t.removeChild(this);
    for (const n in this.events)
      this.events[n].clear();
    for (const n in this.features) {
      const s = this.features[n];
      s && (s.unmount(), s.isMounted = !1);
    }
    this.current = null;
  }
  addChild(t) {
    this.children.add(t), this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set()), this.enteringChildren.add(t);
  }
  removeChild(t) {
    this.children.delete(t), this.enteringChildren && this.enteringChildren.delete(t);
  }
  bindToMotionValue(t, n) {
    this.valueSubscriptions.has(t) && this.valueSubscriptions.get(t)();
    const s = Re.has(t);
    s && this.onBindTransform && this.onBindTransform();
    const i = n.on("change", (r) => {
      this.latestValues[t] = r, this.props.onUpdate && I.preRender(this.notifyUpdate), s && this.projection && (this.projection.isTransformDirty = !0), this.scheduleRender();
    });
    let a;
    typeof window < "u" && window.MotionCheckAppearSync && (a = window.MotionCheckAppearSync(this, t, n)), this.valueSubscriptions.set(t, () => {
      i(), a && a(), n.owner && n.stop();
    });
  }
  sortNodePosition(t) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== t.type ? 0 : this.sortInstanceNodePosition(this.current, t.current);
  }
  updateFeatures() {
    let t = "animation";
    for (t in ut) {
      const n = ut[t];
      if (!n)
        continue;
      const { isEnabled: s, Feature: i } = n;
      if (!this.features[t] && i && s(this.props) && (this.features[t] = new i(this)), this.features[t]) {
        const a = this.features[t];
        a.isMounted ? a.update() : (a.mount(), a.isMounted = !0);
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : U();
  }
  getStaticValue(t) {
    return this.latestValues[t];
  }
  setStaticValue(t, n) {
    this.latestValues[t] = n;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(t, n) {
    (t.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = t, this.prevPresenceContext = this.presenceContext, this.presenceContext = n;
    for (let s = 0; s < ps.length; s++) {
      const i = ps[s];
      this.propEventSubscriptions[i] && (this.propEventSubscriptions[i](), delete this.propEventSubscriptions[i]);
      const a = "on" + i, r = t[a];
      r && (this.propEventSubscriptions[i] = this.on(i, r));
    }
    this.prevMotionValues = gl(this, this.scrapeMotionValuesFromProps(t, this.prevProps || {}, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(t) {
    return this.props.variants ? this.props.variants[t] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(t) {
    const n = this.getClosestVariantNode();
    if (n)
      return n.variantChildren && n.variantChildren.add(t), () => n.variantChildren.delete(t);
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(t, n) {
    const s = this.values.get(t);
    n !== s && (s && this.removeValue(t), this.bindToMotionValue(t, n), this.values.set(t, n), this.latestValues[t] = n.get());
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(t) {
    this.values.delete(t);
    const n = this.valueSubscriptions.get(t);
    n && (n(), this.valueSubscriptions.delete(t)), delete this.latestValues[t], this.removeValueFromRenderState(t, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(t) {
    return this.values.has(t);
  }
  getValue(t, n) {
    if (this.props.values && this.props.values[t])
      return this.props.values[t];
    let s = this.values.get(t);
    return s === void 0 && n !== void 0 && (s = Ae(n === null ? void 0 : n, { owner: this }), this.addValue(t, s)), s;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(t, n) {
    let s = this.latestValues[t] !== void 0 || !this.current ? this.latestValues[t] : this.getBaseTargetFromProps(this.props, t) ?? this.readValueFromInstance(this.current, t, this.options);
    return s != null && (typeof s == "string" && (hi(s) || mi(s)) ? s = parseFloat(s) : !hl(s) && me.test(n) && (s = er(t, n)), this.setBaseTarget(t, X(s) ? s.get() : s)), X(s) ? s.get() : s;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(t, n) {
    this.baseTarget[t] = n;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(t) {
    var a;
    const { initial: n } = this.props;
    let s;
    if (typeof n == "string" || typeof n == "object") {
      const r = $n(this.props, n, (a = this.presenceContext) == null ? void 0 : a.custom);
      r && (s = r[t]);
    }
    if (n && s !== void 0)
      return s;
    const i = this.getBaseTargetFromProps(this.props, t);
    return i !== void 0 && !X(i) ? i : this.initialValues[t] !== void 0 && s === void 0 ? void 0 : this.baseTarget[t];
  }
  on(t, n) {
    return this.events[t] || (this.events[t] = new xn()), this.events[t].add(n);
  }
  notify(t, ...n) {
    this.events[t] && this.events[t].notify(...n);
  }
  scheduleRenderMicrotask() {
    Bn.render(this.render);
  }
}
class cr extends xl {
  constructor() {
    super(...arguments), this.KeyframeResolver = el;
  }
  sortInstanceNodePosition(t, n) {
    return t.compareDocumentPosition(n) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(t, n) {
    const s = t.style;
    return s ? s[n] : void 0;
  }
  removeValueFromRenderState(t, { vars: n, style: s }) {
    delete n[t], delete s[t];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: t } = this.props;
    X(t) && (this.childSubscription = t.on("change", (n) => {
      this.current && (this.current.textContent = `${n}`);
    }));
  }
}
class pe {
  constructor(t) {
    this.isMounted = !1, this.node = t;
  }
  update() {
  }
}
function dr({ top: e, left: t, right: n, bottom: s }) {
  return {
    x: { min: t, max: n },
    y: { min: e, max: s }
  };
}
function vl({ x: e, y: t }) {
  return { top: t.min, right: e.max, bottom: t.max, left: e.min };
}
function bl(e, t) {
  if (!t)
    return e;
  const n = t({ x: e.left, y: e.top }), s = t({ x: e.right, y: e.bottom });
  return {
    top: n.y,
    left: n.x,
    bottom: s.y,
    right: s.x
  };
}
function Lt(e) {
  return e === void 0 || e === 1;
}
function an({ scale: e, scaleX: t, scaleY: n }) {
  return !Lt(e) || !Lt(t) || !Lt(n);
}
function ye(e) {
  return an(e) || ur(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.skewX || e.skewY;
}
function ur(e) {
  return gs(e.x) || gs(e.y);
}
function gs(e) {
  return e && e !== "0%";
}
function ht(e, t, n) {
  const s = e - n, i = t * s;
  return n + i;
}
function ys(e, t, n, s, i) {
  return i !== void 0 && (e = ht(e, i, s)), ht(e, n, s) + t;
}
function on(e, t = 0, n = 1, s, i) {
  e.min = ys(e.min, t, n, s, i), e.max = ys(e.max, t, n, s, i);
}
function hr(e, { x: t, y: n }) {
  on(e.x, t.translate, t.scale, t.originPoint), on(e.y, n.translate, n.scale, n.originPoint);
}
const xs = 0.999999999999, vs = 1.0000000000001;
function wl(e, t, n, s = !1) {
  const i = n.length;
  if (!i)
    return;
  t.x = t.y = 1;
  let a, r;
  for (let o = 0; o < i; o++) {
    a = n[o], r = a.projectionDelta;
    const { visualElement: c } = a.options;
    c && c.props.style && c.props.style.display === "contents" || (s && a.options.layoutScroll && a.scroll && a !== a.root && Me(e, {
      x: -a.scroll.offset.x,
      y: -a.scroll.offset.y
    }), r && (t.x *= r.x.scale, t.y *= r.y.scale, hr(e, r)), s && ye(a.latestValues) && Me(e, a.latestValues));
  }
  t.x < vs && t.x > xs && (t.x = 1), t.y < vs && t.y > xs && (t.y = 1);
}
function Ce(e, t) {
  e.min = e.min + t, e.max = e.max + t;
}
function bs(e, t, n, s, i = 0.5) {
  const a = O(e.min, e.max, i);
  on(e, t, n, a, s);
}
function Me(e, t) {
  bs(e.x, t.x, t.scaleX, t.scale, t.originX), bs(e.y, t.y, t.scaleY, t.scale, t.originY);
}
function fr(e, t) {
  return dr(bl(e.getBoundingClientRect(), t));
}
function Nl(e, t, n) {
  const s = fr(e, n), { scroll: i } = t;
  return i && (Ce(s.x, i.offset.x), Ce(s.y, i.offset.y)), s;
}
const Tl = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, kl = $e.length;
function Sl(e, t, n) {
  let s = "", i = !0;
  for (let a = 0; a < kl; a++) {
    const r = $e[a], o = e[r];
    if (o === void 0)
      continue;
    let c = !0;
    if (typeof o == "number")
      c = o === (r.startsWith("scale") ? 1 : 0);
    else {
      const u = parseFloat(o);
      c = r.startsWith("scale") ? u === 1 : u === 0;
    }
    if (!c || n) {
      const u = tr(o, En[r]);
      if (!c) {
        i = !1;
        const d = Tl[r] || r;
        s += `${d}(${u}) `;
      }
      n && (t[r] = u);
    }
  }
  return s = s.trim(), n ? s = n(t, i ? "" : s) : i && (s = "none"), s;
}
function On(e, t, n) {
  const { style: s, vars: i, transformOrigin: a } = e;
  let r = !1, o = !1;
  for (const c in t) {
    const u = t[c];
    if (Re.has(c)) {
      r = !0;
      continue;
    } else if (Pi(c)) {
      i[c] = u;
      continue;
    } else {
      const d = tr(u, En[c]);
      c.startsWith("origin") ? (o = !0, a[c] = d) : s[c] = d;
    }
  }
  if (t.transform || (r || n ? s.transform = Sl(t, e.transform, n) : s.transform && (s.transform = "none")), o) {
    const { originX: c = "50%", originY: u = "50%", originZ: d = 0 } = a;
    s.transformOrigin = `${c} ${u} ${d}`;
  }
}
function mr(e, { style: t, vars: n }, s, i) {
  const a = e.style;
  let r;
  for (r in t)
    a[r] = t[r];
  i == null || i.applyProjectionStyles(a, s);
  for (r in n)
    a.setProperty(r, n[r]);
}
function ws(e, t) {
  return t.max === t.min ? 0 : e / (t.max - t.min) * 100;
}
const Ie = {
  correct: (e, t) => {
    if (!t.target)
      return e;
    if (typeof e == "string")
      if (A.test(e))
        e = parseFloat(e);
      else
        return e;
    const n = ws(e, t.target.x), s = ws(e, t.target.y);
    return `${n}% ${s}%`;
  }
}, Cl = {
  correct: (e, { treeScale: t, projectionDelta: n }) => {
    const s = e, i = me.parse(e);
    if (i.length > 5)
      return s;
    const a = me.createTransformer(e), r = typeof i[0] != "number" ? 1 : 0, o = n.x.scale * t.x, c = n.y.scale * t.y;
    i[0 + r] /= o, i[1 + r] /= c;
    const u = O(o, c, 0.5);
    return typeof i[2 + r] == "number" && (i[2 + r] /= u), typeof i[3 + r] == "number" && (i[3 + r] /= u), a(i);
  }
}, ln = {
  borderRadius: {
    ...Ie,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: Ie,
  borderTopRightRadius: Ie,
  borderBottomLeftRadius: Ie,
  borderBottomRightRadius: Ie,
  boxShadow: Cl
};
function pr(e, { layout: t, layoutId: n }) {
  return Re.has(e) || e.startsWith("origin") || (t || n !== void 0) && (!!ln[e] || e === "opacity");
}
function zn(e, t, n) {
  var r;
  const s = e.style, i = t == null ? void 0 : t.style, a = {};
  if (!s)
    return a;
  for (const o in s)
    (X(s[o]) || i && X(i[o]) || pr(o, e) || ((r = n == null ? void 0 : n.getValue(o)) == null ? void 0 : r.liveStyle) !== void 0) && (a[o] = s[o]);
  return a;
}
function Ml(e) {
  return window.getComputedStyle(e);
}
class Pl extends cr {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = mr;
  }
  readValueFromInstance(t, n) {
    var s;
    if (Re.has(n))
      return (s = this.projection) != null && s.isProjecting ? Gt(n) : Qa(t, n);
    {
      const i = Ml(t), a = (Pi(n) ? i.getPropertyValue(n) : i[n]) || 0;
      return typeof a == "string" ? a.trim() : a;
    }
  }
  measureInstanceViewportBox(t, { transformPagePoint: n }) {
    return fr(t, n);
  }
  build(t, n, s) {
    On(t, n, s.transformTemplate);
  }
  scrapeMotionValuesFromProps(t, n, s) {
    return zn(t, n, s);
  }
}
const Al = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, Ll = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function Vl(e, t, n = 1, s = 0, i = !0) {
  e.pathLength = 1;
  const a = i ? Al : Ll;
  e[a.offset] = `${-s}`, e[a.array] = `${t} ${n}`;
}
const Dl = [
  "offsetDistance",
  "offsetPath",
  "offsetRotate",
  "offsetAnchor"
];
function gr(e, {
  attrX: t,
  attrY: n,
  attrScale: s,
  pathLength: i,
  pathSpacing: a = 1,
  pathOffset: r = 0,
  // This is object creation, which we try to avoid per-frame.
  ...o
}, c, u, d) {
  if (On(e, o, u), c) {
    e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
    return;
  }
  e.attrs = e.style, e.style = {};
  const { attrs: h, style: f } = e;
  h.transform && (f.transform = h.transform, delete h.transform), (f.transform || h.transformOrigin) && (f.transformOrigin = h.transformOrigin ?? "50% 50%", delete h.transformOrigin), f.transform && (f.transformBox = (d == null ? void 0 : d.transformBox) ?? "fill-box", delete h.transformBox);
  for (const m of Dl)
    h[m] !== void 0 && (f[m] = h[m], delete h[m]);
  t !== void 0 && (h.x = t), n !== void 0 && (h.y = n), s !== void 0 && (h.scale = s), i !== void 0 && Vl(h, i, a, r, !1);
}
const yr = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]), xr = (e) => typeof e == "string" && e.toLowerCase() === "svg";
function $l(e, t, n, s) {
  mr(e, t, void 0, s);
  for (const i in t.attrs)
    e.setAttribute(yr.has(i) ? i : Rn(i), t.attrs[i]);
}
function vr(e, t, n) {
  const s = zn(e, t, n);
  for (const i in e)
    if (X(e[i]) || X(t[i])) {
      const a = $e.indexOf(i) !== -1 ? "attr" + i.charAt(0).toUpperCase() + i.substring(1) : i;
      s[a] = e[i];
    }
  return s;
}
class Rl extends cr {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = U;
  }
  getBaseTargetFromProps(t, n) {
    return t[n];
  }
  readValueFromInstance(t, n) {
    if (Re.has(n)) {
      const s = Qi(n);
      return s && s.default || 0;
    }
    return n = yr.has(n) ? n : Rn(n), t.getAttribute(n);
  }
  scrapeMotionValuesFromProps(t, n, s) {
    return vr(t, n, s);
  }
  build(t, n, s) {
    gr(t, n, this.isSVGTag, s.transformTemplate, s.style);
  }
  renderInstance(t, n, s, i) {
    $l(t, n, s, i);
  }
  mount(t) {
    this.isSVGTag = xr(t.tagName), super.mount(t);
  }
}
const El = Fn.length;
function br(e) {
  if (!e)
    return;
  if (!e.isControllingVariants) {
    const n = e.parent ? br(e.parent) || {} : {};
    return e.props.initial !== void 0 && (n.initial = e.props.initial), n;
  }
  const t = {};
  for (let n = 0; n < El; n++) {
    const s = Fn[n], i = e.props[s];
    (Ke(i) || i === !1) && (t[s] = i);
  }
  return t;
}
function wr(e, t) {
  if (!Array.isArray(t))
    return !1;
  const n = t.length;
  if (n !== e.length)
    return !1;
  for (let s = 0; s < n; s++)
    if (t[s] !== e[s])
      return !1;
  return !0;
}
const Bl = [...jn].reverse(), Il = jn.length;
function jl(e) {
  return (t) => Promise.all(t.map(({ animation: n, options: s }) => Uo(e, n, s)));
}
function Fl(e) {
  let t = jl(e), n = Ns(), s = !0;
  const i = (c) => (u, d) => {
    var f;
    const h = Pe(e, d, c === "exit" ? (f = e.presenceContext) == null ? void 0 : f.custom : void 0);
    if (h) {
      const { transition: m, transitionEnd: p, ...g } = h;
      u = { ...u, ...g, ...p };
    }
    return u;
  };
  function a(c) {
    t = c(e);
  }
  function r(c) {
    const { props: u } = e, d = br(e.parent) || {}, h = [], f = /* @__PURE__ */ new Set();
    let m = {}, p = 1 / 0;
    for (let y = 0; y < Il; y++) {
      const w = Bl[y], k = n[w], S = u[w] !== void 0 ? u[w] : d[w], v = Ke(S), x = w === c ? k.isActive : null;
      x === !1 && (p = y);
      let T = S === d[w] && S !== u[w] && v;
      if (T && s && e.manuallyAnimateOnMount && (T = !1), k.protectedKeys = { ...m }, // If it isn't active and hasn't *just* been set as inactive
      !k.isActive && x === null || // If we didn't and don't have any defined prop for this animation type
      !S && !k.prevProp || // Or if the prop doesn't define an animation
      xt(S) || typeof S == "boolean")
        continue;
      const N = Ol(k.prevProp, S);
      let C = N || // If we're making this variant active, we want to always make it active
      w === c && k.isActive && !T && v || // If we removed a higher-priority variant (i is in reverse order)
      y > p && v, P = !1;
      const L = Array.isArray(S) ? S : [S];
      let E = L.reduce(i(w), {});
      x === !1 && (E = {});
      const { prevResolvedValues: G = {} } = k, se = {
        ...G,
        ...E
      }, _ = (V) => {
        C = !0, f.has(V) && (P = !0, f.delete(V)), k.needsAnimating[V] = !0;
        const R = e.getValue(V);
        R && (R.liveStyle = !1);
      };
      for (const V in se) {
        const R = E[V], j = G[V];
        if (m.hasOwnProperty(V))
          continue;
        let z = !1;
        Qt(R) && Qt(j) ? z = !wr(R, j) : z = R !== j, z ? R != null ? _(V) : f.add(V) : R !== void 0 && f.has(V) ? _(V) : k.protectedKeys[V] = !0;
      }
      k.prevProp = S, k.prevResolvedValues = E, k.isActive && (m = { ...m, ...E }), s && e.blockInitialAnimation && (C = !1);
      const Be = T && N;
      C && (!Be || P) && h.push(...L.map((V) => {
        const R = { type: w };
        if (typeof V == "string" && s && !Be && e.manuallyAnimateOnMount && e.parent) {
          const { parent: j } = e, z = Pe(j, V);
          if (j.enteringChildren && z) {
            const { delayChildren: Ne } = z.transition || {};
            R.delay = _i(j.enteringChildren, e, Ne);
          }
        }
        return {
          animation: V,
          options: R
        };
      }));
    }
    if (f.size) {
      const y = {};
      if (typeof u.initial != "boolean") {
        const w = Pe(e, Array.isArray(u.initial) ? u.initial[0] : u.initial);
        w && w.transition && (y.transition = w.transition);
      }
      f.forEach((w) => {
        const k = e.getBaseTarget(w), S = e.getValue(w);
        S && (S.liveStyle = !0), y[w] = k ?? null;
      }), h.push({ animation: y });
    }
    let g = !!h.length;
    return s && (u.initial === !1 || u.initial === u.animate) && !e.manuallyAnimateOnMount && (g = !1), s = !1, g ? t(h) : Promise.resolve();
  }
  function o(c, u) {
    var h;
    if (n[c].isActive === u)
      return Promise.resolve();
    (h = e.variantChildren) == null || h.forEach((f) => {
      var m;
      return (m = f.animationState) == null ? void 0 : m.setActive(c, u);
    }), n[c].isActive = u;
    const d = r(c);
    for (const f in n)
      n[f].protectedKeys = {};
    return d;
  }
  return {
    animateChanges: r,
    setActive: o,
    setAnimateFunction: a,
    getState: () => n,
    reset: () => {
      n = Ns();
    }
  };
}
function Ol(e, t) {
  return typeof t == "string" ? t !== e : Array.isArray(t) ? !wr(t, e) : !1;
}
function ge(e = !1) {
  return {
    isActive: e,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function Ns() {
  return {
    animate: ge(!0),
    whileInView: ge(),
    whileHover: ge(),
    whileTap: ge(),
    whileDrag: ge(),
    whileFocus: ge(),
    exit: ge()
  };
}
function Ts(e, t) {
  e.min = t.min, e.max = t.max;
}
function ie(e, t) {
  Ts(e.x, t.x), Ts(e.y, t.y);
}
function ks(e, t) {
  e.translate = t.translate, e.scale = t.scale, e.originPoint = t.originPoint, e.origin = t.origin;
}
const Nr = 1e-4, zl = 1 - Nr, Wl = 1 + Nr, Tr = 0.01, Hl = 0 - Tr, Ul = 0 + Tr;
function Z(e) {
  return e.max - e.min;
}
function _l(e, t, n) {
  return Math.abs(e - t) <= n;
}
function Ss(e, t, n, s = 0.5) {
  e.origin = s, e.originPoint = O(t.min, t.max, e.origin), e.scale = Z(n) / Z(t), e.translate = O(n.min, n.max, e.origin) - e.originPoint, (e.scale >= zl && e.scale <= Wl || isNaN(e.scale)) && (e.scale = 1), (e.translate >= Hl && e.translate <= Ul || isNaN(e.translate)) && (e.translate = 0);
}
function ze(e, t, n, s) {
  Ss(e.x, t.x, n.x, s ? s.originX : void 0), Ss(e.y, t.y, n.y, s ? s.originY : void 0);
}
function Cs(e, t, n) {
  e.min = n.min + t.min, e.max = e.min + Z(t);
}
function Kl(e, t, n) {
  Cs(e.x, t.x, n.x), Cs(e.y, t.y, n.y);
}
function Ms(e, t, n) {
  e.min = t.min - n.min, e.max = e.min + Z(t);
}
function ft(e, t, n) {
  Ms(e.x, t.x, n.x), Ms(e.y, t.y, n.y);
}
function Ps(e, t, n, s, i) {
  return e -= t, e = ht(e, 1 / n, s), i !== void 0 && (e = ht(e, 1 / i, s)), e;
}
function Gl(e, t = 0, n = 1, s = 0.5, i, a = e, r = e) {
  if (oe.test(t) && (t = parseFloat(t), t = O(r.min, r.max, t / 100) - r.min), typeof t != "number")
    return;
  let o = O(a.min, a.max, s);
  e === a && (o -= t), e.min = Ps(e.min, t, n, o, i), e.max = Ps(e.max, t, n, o, i);
}
function As(e, t, [n, s, i], a, r) {
  Gl(e, t[n], t[s], t[i], t.scale, a, r);
}
const Yl = ["x", "scaleX", "originX"], Xl = ["y", "scaleY", "originY"];
function Ls(e, t, n, s) {
  As(e.x, t, Yl, n ? n.x : void 0, s ? s.x : void 0), As(e.y, t, Xl, n ? n.y : void 0, s ? s.y : void 0);
}
function Vs(e) {
  return e.translate === 0 && e.scale === 1;
}
function kr(e) {
  return Vs(e.x) && Vs(e.y);
}
function Ds(e, t) {
  return e.min === t.min && e.max === t.max;
}
function ql(e, t) {
  return Ds(e.x, t.x) && Ds(e.y, t.y);
}
function $s(e, t) {
  return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max);
}
function Sr(e, t) {
  return $s(e.x, t.x) && $s(e.y, t.y);
}
function Rs(e) {
  return Z(e.x) / Z(e.y);
}
function Es(e, t) {
  return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
}
function Q(e) {
  return [e("x"), e("y")];
}
function Zl(e, t, n) {
  let s = "";
  const i = e.x.translate / t.x, a = e.y.translate / t.y, r = (n == null ? void 0 : n.z) || 0;
  if ((i || a || r) && (s = `translate3d(${i}px, ${a}px, ${r}px) `), (t.x !== 1 || t.y !== 1) && (s += `scale(${1 / t.x}, ${1 / t.y}) `), n) {
    const { transformPerspective: u, rotate: d, rotateX: h, rotateY: f, skewX: m, skewY: p } = n;
    u && (s = `perspective(${u}px) ${s}`), d && (s += `rotate(${d}deg) `), h && (s += `rotateX(${h}deg) `), f && (s += `rotateY(${f}deg) `), m && (s += `skewX(${m}deg) `), p && (s += `skewY(${p}deg) `);
  }
  const o = e.x.scale * t.x, c = e.y.scale * t.y;
  return (o !== 1 || c !== 1) && (s += `scale(${o}, ${c})`), s || "none";
}
const Cr = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], Jl = Cr.length, Bs = (e) => typeof e == "string" ? parseFloat(e) : e, Is = (e) => typeof e == "number" || A.test(e);
function Ql(e, t, n, s, i, a) {
  i ? (e.opacity = O(0, n.opacity ?? 1, ec(s)), e.opacityExit = O(t.opacity ?? 1, 0, tc(s))) : a && (e.opacity = O(t.opacity ?? 1, n.opacity ?? 1, s));
  for (let r = 0; r < Jl; r++) {
    const o = `border${Cr[r]}Radius`;
    let c = js(t, o), u = js(n, o);
    if (c === void 0 && u === void 0)
      continue;
    c || (c = 0), u || (u = 0), c === 0 || u === 0 || Is(c) === Is(u) ? (e[o] = Math.max(O(Bs(c), Bs(u), s), 0), (oe.test(u) || oe.test(c)) && (e[o] += "%")) : e[o] = u;
  }
  (t.rotate || n.rotate) && (e.rotate = O(t.rotate || 0, n.rotate || 0, s));
}
function js(e, t) {
  return e[t] !== void 0 ? e[t] : e.borderRadius;
}
const ec = /* @__PURE__ */ Mr(0, 0.5, Ni), tc = /* @__PURE__ */ Mr(0.5, 0.95, te);
function Mr(e, t, n) {
  return (s) => s < e ? 0 : s > t ? 1 : n(/* @__PURE__ */ He(e, t, s));
}
function nc(e, t, n) {
  const s = X(e) ? e : Ae(e);
  return s.start(Dn("", s, t, n)), s.animation;
}
function Ge(e, t, n, s = { passive: !0 }) {
  return e.addEventListener(t, n, s), () => e.removeEventListener(t, n);
}
const sc = (e, t) => e.depth - t.depth;
class ic {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(t) {
    pn(this.children, t), this.isDirty = !0;
  }
  remove(t) {
    gn(this.children, t), this.isDirty = !0;
  }
  forEach(t) {
    this.isDirty && this.children.sort(sc), this.isDirty = !1, this.children.forEach(t);
  }
}
function rc(e, t) {
  const n = q.now(), s = ({ timestamp: i }) => {
    const a = i - n;
    a >= t && (fe(s), e(a - t));
  };
  return I.setup(s, !0), () => fe(s);
}
function at(e) {
  return X(e) ? e.get() : e;
}
class ac {
  constructor() {
    this.members = [];
  }
  add(t) {
    pn(this.members, t), t.scheduleRender();
  }
  remove(t) {
    if (gn(this.members, t), t === this.prevLead && (this.prevLead = void 0), t === this.lead) {
      const n = this.members[this.members.length - 1];
      n && this.promote(n);
    }
  }
  relegate(t) {
    const n = this.members.findIndex((i) => t === i);
    if (n === 0)
      return !1;
    let s;
    for (let i = n; i >= 0; i--) {
      const a = this.members[i];
      if (a.isPresent !== !1) {
        s = a;
        break;
      }
    }
    return s ? (this.promote(s), !0) : !1;
  }
  promote(t, n) {
    const s = this.lead;
    if (t !== s && (this.prevLead = s, this.lead = t, t.show(), s)) {
      s.instance && s.scheduleRender(), t.scheduleRender();
      const i = s.options.layoutDependency, a = t.options.layoutDependency;
      i !== void 0 && a !== void 0 && i === a || (t.resumeFrom = s, n && (t.resumeFrom.preserveOpacity = !0), s.snapshot && (t.snapshot = s.snapshot, t.snapshot.latestValues = s.animationValues || s.latestValues), t.root && t.root.isUpdating && (t.isLayoutDirty = !0));
      const { crossfade: o } = t.options;
      o === !1 && s.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((t) => {
      const { options: n, resumingFrom: s } = t;
      n.onExitComplete && n.onExitComplete(), s && s.options.onExitComplete && s.options.onExitComplete();
    });
  }
  scheduleRender() {
    this.members.forEach((t) => {
      t.instance && t.scheduleRender(!1);
    });
  }
  /**
   * Clear any leads that have been removed this render to prevent them from being
   * used in future animations and to prevent memory leaks
   */
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
const ot = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: !0,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: !1
}, Vt = ["", "X", "Y", "Z"], oc = 1e3;
let lc = 0;
function Dt(e, t, n, s) {
  const { latestValues: i } = t;
  i[e] && (n[e] = i[e], t.setStaticValue(e, 0), s && (s[e] = 0));
}
function Pr(e) {
  if (e.hasCheckedOptimisedAppear = !0, e.root === e)
    return;
  const { visualElement: t } = e.options;
  if (!t)
    return;
  const n = Xi(t);
  if (window.MotionHasOptimisedAnimation(n, "transform")) {
    const { layout: i, layoutId: a } = e.options;
    window.MotionCancelOptimisedAnimation(n, "transform", I, !(i || a));
  }
  const { parent: s } = e;
  s && !s.hasCheckedOptimisedAppear && Pr(s);
}
function Ar({ attachResizeListener: e, defaultParent: t, measureScroll: n, checkIsScrollRoot: s, resetTransform: i }) {
  return class {
    constructor(r = {}, o = t == null ? void 0 : t()) {
      this.id = lc++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.layoutVersion = 0, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(uc), this.nodes.forEach(pc), this.nodes.forEach(gc), this.nodes.forEach(hc);
      }, this.resolvedRelativeTargetAt = 0, this.linkedParentVersion = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = r, this.root = o ? o.root || o : this, this.path = o ? [...o.path, o] : [], this.parent = o, this.depth = o ? o.depth + 1 : 0;
      for (let c = 0; c < this.path.length; c++)
        this.path[c].shouldResetTransform = !0;
      this.root === this && (this.nodes = new ic());
    }
    addEventListener(r, o) {
      return this.eventHandlers.has(r) || this.eventHandlers.set(r, new xn()), this.eventHandlers.get(r).add(o);
    }
    notifyListeners(r, ...o) {
      const c = this.eventHandlers.get(r);
      c && c.notify(...o);
    }
    hasListeners(r) {
      return this.eventHandlers.has(r);
    }
    /**
     * Lifecycles
     */
    mount(r) {
      if (this.instance)
        return;
      this.isSVG = rr(r) && !dl(r), this.instance = r;
      const { layoutId: o, layout: c, visualElement: u } = this.options;
      if (u && !u.current && u.mount(r), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (c || o) && (this.isLayoutDirty = !0), e) {
        let d, h = 0;
        const f = () => this.root.updateBlockedByResize = !1;
        I.read(() => {
          h = window.innerWidth;
        }), e(r, () => {
          const m = window.innerWidth;
          m !== h && (h = m, this.root.updateBlockedByResize = !0, d && d(), d = rc(f, 250), ot.hasAnimatedSinceResize && (ot.hasAnimatedSinceResize = !1, this.nodes.forEach(zs)));
        });
      }
      o && this.root.registerSharedNode(o, this), this.options.animate !== !1 && u && (o || c) && this.addEventListener("didUpdate", ({ delta: d, hasLayoutChanged: h, hasRelativeLayoutChanged: f, layout: m }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const p = this.options.transition || u.getDefaultTransition() || wc, { onLayoutAnimationStart: g, onLayoutAnimationComplete: y } = u.getProps(), w = !this.targetLayout || !Sr(this.targetLayout, m), k = !h && f;
        if (this.options.layoutRoot || this.resumeFrom || k || h && (w || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
          const S = {
            ...Vn(p, "layout"),
            onPlay: g,
            onComplete: y
          };
          (u.shouldReduceMotion || this.options.layoutRoot) && (S.delay = 0, S.type = !1), this.startAnimation(S), this.setAnimationOrigin(d, k);
        } else
          h || zs(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = m;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const r = this.getStack();
      r && r.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), fe(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
    }
    // Note: currently only running on root node
    startUpdate() {
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(yc), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: r } = this.options;
      return r && r.getProps().transformTemplate;
    }
    willUpdate(r = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Pr(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let d = 0; d < this.path.length; d++) {
        const h = this.path[d];
        h.shouldResetTransform = !0, h.updateScroll("snapshot"), h.options.layoutRoot && h.willUpdate(!1);
      }
      const { layoutId: o, layout: c } = this.options;
      if (o === void 0 && !c)
        return;
      const u = this.getTransformTemplate();
      this.prevTransformTemplateValue = u ? u(this.latestValues, "") : void 0, this.updateSnapshot(), r && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(Fs);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(Os);
        return;
      }
      this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(mc), this.nodes.forEach(cc), this.nodes.forEach(dc)) : this.nodes.forEach(Os), this.clearAllSnapshots();
      const o = q.now();
      K.delta = le(0, 1e3 / 60, o - K.timestamp), K.timestamp = o, K.isProcessing = !0, Tt.update.process(K), Tt.preRender.process(K), Tt.render.process(K), K.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, Bn.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(fc), this.sharedNodes.forEach(xc);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, I.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      I.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !Z(this.snapshot.measuredBox.x) && !Z(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let c = 0; c < this.path.length; c++)
          this.path[c].updateScroll();
      const r = this.layout;
      this.layout = this.measure(!1), this.layoutVersion++, this.layoutCorrected = U(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: o } = this.options;
      o && o.notify("LayoutMeasure", this.layout.layoutBox, r ? r.layoutBox : void 0);
    }
    updateScroll(r = "measure") {
      let o = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === r && (o = !1), o && this.instance) {
        const c = s(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: r,
          isRoot: c,
          offset: n(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : c
        };
      }
    }
    resetTransform() {
      if (!i)
        return;
      const r = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, o = this.projectionDelta && !kr(this.projectionDelta), c = this.getTransformTemplate(), u = c ? c(this.latestValues, "") : void 0, d = u !== this.prevTransformTemplateValue;
      r && this.instance && (o || ye(this.latestValues) || d) && (i(this.instance, u), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(r = !0) {
      const o = this.measurePageBox();
      let c = this.removeElementScroll(o);
      return r && (c = this.removeTransform(c)), Nc(c), {
        animationId: this.root.animationId,
        measuredBox: o,
        layoutBox: c,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      var u;
      const { visualElement: r } = this.options;
      if (!r)
        return U();
      const o = r.measureViewportBox();
      if (!(((u = this.scroll) == null ? void 0 : u.wasRoot) || this.path.some(Tc))) {
        const { scroll: d } = this.root;
        d && (Ce(o.x, d.offset.x), Ce(o.y, d.offset.y));
      }
      return o;
    }
    removeElementScroll(r) {
      var c;
      const o = U();
      if (ie(o, r), (c = this.scroll) != null && c.wasRoot)
        return o;
      for (let u = 0; u < this.path.length; u++) {
        const d = this.path[u], { scroll: h, options: f } = d;
        d !== this.root && h && f.layoutScroll && (h.wasRoot && ie(o, r), Ce(o.x, h.offset.x), Ce(o.y, h.offset.y));
      }
      return o;
    }
    applyTransform(r, o = !1) {
      const c = U();
      ie(c, r);
      for (let u = 0; u < this.path.length; u++) {
        const d = this.path[u];
        !o && d.options.layoutScroll && d.scroll && d !== d.root && Me(c, {
          x: -d.scroll.offset.x,
          y: -d.scroll.offset.y
        }), ye(d.latestValues) && Me(c, d.latestValues);
      }
      return ye(this.latestValues) && Me(c, this.latestValues), c;
    }
    removeTransform(r) {
      const o = U();
      ie(o, r);
      for (let c = 0; c < this.path.length; c++) {
        const u = this.path[c];
        if (!u.instance || !ye(u.latestValues))
          continue;
        an(u.latestValues) && u.updateSnapshot();
        const d = U(), h = u.measurePageBox();
        ie(d, h), Ls(o, u.latestValues, u.snapshot ? u.snapshot.layoutBox : void 0, d);
      }
      return ye(this.latestValues) && Ls(o, this.latestValues), o;
    }
    setTargetDelta(r) {
      this.targetDelta = r, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(r) {
      this.options = {
        ...this.options,
        ...r,
        crossfade: r.crossfade !== void 0 ? r.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== K.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(r = !1) {
      var m;
      const o = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = o.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = o.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = o.isSharedProjectionDirty);
      const c = !!this.resumingFrom || this !== o;
      if (!(r || c && this.isSharedProjectionDirty || this.isProjectionDirty || (m = this.parent) != null && m.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: d, layoutId: h } = this.options;
      if (!this.layout || !(d || h))
        return;
      this.resolvedRelativeTargetAt = K.timestamp;
      const f = this.getClosestProjectingParent();
      f && this.linkedParentVersion !== f.layoutVersion && !f.options.layoutRoot && this.removeRelativeTarget(), !this.targetDelta && !this.relativeTarget && (f && f.layout ? this.createRelativeTarget(f, this.layout.layoutBox, f.layout.layoutBox) : this.removeRelativeTarget()), !(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = U(), this.targetWithTransforms = U()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), Kl(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : ie(this.target, this.layout.layoutBox), hr(this.target, this.targetDelta)) : ie(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = !1, f && !!f.resumingFrom == !!this.resumingFrom && !f.options.layoutScroll && f.target && this.animationProgress !== 1 ? this.createRelativeTarget(f, this.target, f.target) : this.relativeParent = this.relativeTarget = void 0));
    }
    getClosestProjectingParent() {
      if (!(!this.parent || an(this.parent.latestValues) || ur(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    createRelativeTarget(r, o, c) {
      this.relativeParent = r, this.linkedParentVersion = r.layoutVersion, this.forceRelativeParentToResolveTarget(), this.relativeTarget = U(), this.relativeTargetOrigin = U(), ft(this.relativeTargetOrigin, o, c), ie(this.relativeTarget, this.relativeTargetOrigin);
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = void 0;
    }
    calcProjection() {
      var p;
      const r = this.getLead(), o = !!this.resumingFrom || this !== r;
      let c = !0;
      if ((this.isProjectionDirty || (p = this.parent) != null && p.isProjectionDirty) && (c = !1), o && (this.isSharedProjectionDirty || this.isTransformDirty) && (c = !1), this.resolvedRelativeTargetAt === K.timestamp && (c = !1), c)
        return;
      const { layout: u, layoutId: d } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(u || d))
        return;
      ie(this.layoutCorrected, this.layout.layoutBox);
      const h = this.treeScale.x, f = this.treeScale.y;
      wl(this.layoutCorrected, this.treeScale, this.path, o), r.layout && !r.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (r.target = r.layout.layoutBox, r.targetWithTransforms = U());
      const { target: m } = r;
      if (!m) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (ks(this.prevProjectionDelta.x, this.projectionDelta.x), ks(this.prevProjectionDelta.y, this.projectionDelta.y)), ze(this.projectionDelta, this.layoutCorrected, m, this.latestValues), (this.treeScale.x !== h || this.treeScale.y !== f || !Es(this.projectionDelta.x, this.prevProjectionDelta.x) || !Es(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", m));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(r = !0) {
      var o;
      if ((o = this.options.visualElement) == null || o.scheduleRender(), r) {
        const c = this.getStack();
        c && c.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = Se(), this.projectionDelta = Se(), this.projectionDeltaWithTransform = Se();
    }
    setAnimationOrigin(r, o = !1) {
      const c = this.snapshot, u = c ? c.latestValues : {}, d = { ...this.latestValues }, h = Se();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !o;
      const f = U(), m = c ? c.source : void 0, p = this.layout ? this.layout.source : void 0, g = m !== p, y = this.getStack(), w = !y || y.members.length <= 1, k = !!(g && !w && this.options.crossfade === !0 && !this.path.some(bc));
      this.animationProgress = 0;
      let S;
      this.mixTargetDelta = (v) => {
        const x = v / 1e3;
        Ws(h.x, r.x, x), Ws(h.y, r.y, x), this.setTargetDelta(h), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (ft(f, this.layout.layoutBox, this.relativeParent.layout.layoutBox), vc(this.relativeTarget, this.relativeTargetOrigin, f, x), S && ql(this.relativeTarget, S) && (this.isProjectionDirty = !1), S || (S = U()), ie(S, this.relativeTarget)), g && (this.animationValues = d, Ql(d, u, this.latestValues, x, k, w)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = x;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(r) {
      var o, c, u;
      this.notifyListeners("animationStart"), (o = this.currentAnimation) == null || o.stop(), (u = (c = this.resumingFrom) == null ? void 0 : c.currentAnimation) == null || u.stop(), this.pendingAnimation && (fe(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = I.update(() => {
        ot.hasAnimatedSinceResize = !0, this.motionValue || (this.motionValue = Ae(0)), this.currentAnimation = nc(this.motionValue, [0, 1e3], {
          ...r,
          velocity: 0,
          isSync: !0,
          onUpdate: (d) => {
            this.mixTargetDelta(d), r.onUpdate && r.onUpdate(d);
          },
          onStop: () => {
          },
          onComplete: () => {
            r.onComplete && r.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const r = this.getStack();
      r && r.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(oc), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const r = this.getLead();
      let { targetWithTransforms: o, target: c, layout: u, latestValues: d } = r;
      if (!(!o || !c || !u)) {
        if (this !== r && this.layout && u && Lr(this.options.animationType, this.layout.layoutBox, u.layoutBox)) {
          c = this.target || U();
          const h = Z(this.layout.layoutBox.x);
          c.x.min = r.target.x.min, c.x.max = c.x.min + h;
          const f = Z(this.layout.layoutBox.y);
          c.y.min = r.target.y.min, c.y.max = c.y.min + f;
        }
        ie(o, c), Me(o, d), ze(this.projectionDeltaWithTransform, this.layoutCorrected, o, d);
      }
    }
    registerSharedNode(r, o) {
      this.sharedNodes.has(r) || this.sharedNodes.set(r, new ac()), this.sharedNodes.get(r).add(o);
      const u = o.options.initialPromotionConfig;
      o.promote({
        transition: u ? u.transition : void 0,
        preserveFollowOpacity: u && u.shouldPreserveFollowOpacity ? u.shouldPreserveFollowOpacity(o) : void 0
      });
    }
    isLead() {
      const r = this.getStack();
      return r ? r.lead === this : !0;
    }
    getLead() {
      var o;
      const { layoutId: r } = this.options;
      return r ? ((o = this.getStack()) == null ? void 0 : o.lead) || this : this;
    }
    getPrevLead() {
      var o;
      const { layoutId: r } = this.options;
      return r ? (o = this.getStack()) == null ? void 0 : o.prevLead : void 0;
    }
    getStack() {
      const { layoutId: r } = this.options;
      if (r)
        return this.root.sharedNodes.get(r);
    }
    promote({ needsReset: r, transition: o, preserveFollowOpacity: c } = {}) {
      const u = this.getStack();
      u && u.promote(this, c), r && (this.projectionDelta = void 0, this.needsReset = !0), o && this.setOptions({ transition: o });
    }
    relegate() {
      const r = this.getStack();
      return r ? r.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: r } = this.options;
      if (!r)
        return;
      let o = !1;
      const { latestValues: c } = r;
      if ((c.z || c.rotate || c.rotateX || c.rotateY || c.rotateZ || c.skewX || c.skewY) && (o = !0), !o)
        return;
      const u = {};
      c.z && Dt("z", r, u, this.animationValues);
      for (let d = 0; d < Vt.length; d++)
        Dt(`rotate${Vt[d]}`, r, u, this.animationValues), Dt(`skew${Vt[d]}`, r, u, this.animationValues);
      r.render();
      for (const d in u)
        r.setStaticValue(d, u[d]), this.animationValues && (this.animationValues[d] = u[d]);
      r.scheduleRender();
    }
    applyProjectionStyles(r, o) {
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible) {
        r.visibility = "hidden";
        return;
      }
      const c = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = !1, r.visibility = "", r.opacity = "", r.pointerEvents = at(o == null ? void 0 : o.pointerEvents) || "", r.transform = c ? c(this.latestValues, "") : "none";
        return;
      }
      const u = this.getLead();
      if (!this.projectionDelta || !this.layout || !u.target) {
        this.options.layoutId && (r.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, r.pointerEvents = at(o == null ? void 0 : o.pointerEvents) || ""), this.hasProjected && !ye(this.latestValues) && (r.transform = c ? c({}, "") : "none", this.hasProjected = !1);
        return;
      }
      r.visibility = "";
      const d = u.animationValues || u.latestValues;
      this.applyTransformsToTarget();
      let h = Zl(this.projectionDeltaWithTransform, this.treeScale, d);
      c && (h = c(d, h)), r.transform = h;
      const { x: f, y: m } = this.projectionDelta;
      r.transformOrigin = `${f.origin * 100}% ${m.origin * 100}% 0`, u.animationValues ? r.opacity = u === this ? d.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : d.opacityExit : r.opacity = u === this ? d.opacity !== void 0 ? d.opacity : "" : d.opacityExit !== void 0 ? d.opacityExit : 0;
      for (const p in ln) {
        if (d[p] === void 0)
          continue;
        const { correct: g, applyTo: y, isCSSVariable: w } = ln[p], k = h === "none" ? d[p] : g(d[p], u);
        if (y) {
          const S = y.length;
          for (let v = 0; v < S; v++)
            r[y[v]] = k;
        } else
          w ? this.options.visualElement.renderState.vars[p] = k : r[p] = k;
      }
      this.options.layoutId && (r.pointerEvents = u === this ? at(o == null ? void 0 : o.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((r) => {
        var o;
        return (o = r.currentAnimation) == null ? void 0 : o.stop();
      }), this.root.nodes.forEach(Fs), this.root.sharedNodes.clear();
    }
  };
}
function cc(e) {
  e.updateLayout();
}
function dc(e) {
  var n;
  const t = ((n = e.resumeFrom) == null ? void 0 : n.snapshot) || e.snapshot;
  if (e.isLead() && e.layout && t && e.hasListeners("didUpdate")) {
    const { layoutBox: s, measuredBox: i } = e.layout, { animationType: a } = e.options, r = t.source !== e.layout.source;
    a === "size" ? Q((h) => {
      const f = r ? t.measuredBox[h] : t.layoutBox[h], m = Z(f);
      f.min = s[h].min, f.max = f.min + m;
    }) : Lr(a, t.layoutBox, s) && Q((h) => {
      const f = r ? t.measuredBox[h] : t.layoutBox[h], m = Z(s[h]);
      f.max = f.min + m, e.relativeTarget && !e.currentAnimation && (e.isProjectionDirty = !0, e.relativeTarget[h].max = e.relativeTarget[h].min + m);
    });
    const o = Se();
    ze(o, s, t.layoutBox);
    const c = Se();
    r ? ze(c, e.applyTransform(i, !0), t.measuredBox) : ze(c, s, t.layoutBox);
    const u = !kr(o);
    let d = !1;
    if (!e.resumeFrom) {
      const h = e.getClosestProjectingParent();
      if (h && !h.resumeFrom) {
        const { snapshot: f, layout: m } = h;
        if (f && m) {
          const p = U();
          ft(p, t.layoutBox, f.layoutBox);
          const g = U();
          ft(g, s, m.layoutBox), Sr(p, g) || (d = !0), h.options.layoutRoot && (e.relativeTarget = g, e.relativeTargetOrigin = p, e.relativeParent = h);
        }
      }
    }
    e.notifyListeners("didUpdate", {
      layout: s,
      snapshot: t,
      delta: c,
      layoutDelta: o,
      hasLayoutChanged: u,
      hasRelativeLayoutChanged: d
    });
  } else if (e.isLead()) {
    const { onExitComplete: s } = e.options;
    s && s();
  }
  e.options.transition = void 0;
}
function uc(e) {
  e.parent && (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty), e.isSharedProjectionDirty || (e.isSharedProjectionDirty = !!(e.isProjectionDirty || e.parent.isProjectionDirty || e.parent.isSharedProjectionDirty)), e.isTransformDirty || (e.isTransformDirty = e.parent.isTransformDirty));
}
function hc(e) {
  e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
}
function fc(e) {
  e.clearSnapshot();
}
function Fs(e) {
  e.clearMeasurements();
}
function Os(e) {
  e.isLayoutDirty = !1;
}
function mc(e) {
  const { visualElement: t } = e.options;
  t && t.getProps().onBeforeLayoutMeasure && t.notify("BeforeLayoutMeasure"), e.resetTransform();
}
function zs(e) {
  e.finishAnimation(), e.targetDelta = e.relativeTarget = e.target = void 0, e.isProjectionDirty = !0;
}
function pc(e) {
  e.resolveTargetDelta();
}
function gc(e) {
  e.calcProjection();
}
function yc(e) {
  e.resetSkewAndRotation();
}
function xc(e) {
  e.removeLeadSnapshot();
}
function Ws(e, t, n) {
  e.translate = O(t.translate, 0, n), e.scale = O(t.scale, 1, n), e.origin = t.origin, e.originPoint = t.originPoint;
}
function Hs(e, t, n, s) {
  e.min = O(t.min, n.min, s), e.max = O(t.max, n.max, s);
}
function vc(e, t, n, s) {
  Hs(e.x, t.x, n.x, s), Hs(e.y, t.y, n.y, s);
}
function bc(e) {
  return e.animationValues && e.animationValues.opacityExit !== void 0;
}
const wc = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, Us = (e) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e), _s = Us("applewebkit/") && !Us("chrome/") ? Math.round : te;
function Ks(e) {
  e.min = _s(e.min), e.max = _s(e.max);
}
function Nc(e) {
  Ks(e.x), Ks(e.y);
}
function Lr(e, t, n) {
  return e === "position" || e === "preserve-aspect" && !_l(Rs(t), Rs(n), 0.2);
}
function Tc(e) {
  var t;
  return e !== e.root && ((t = e.scroll) == null ? void 0 : t.wasRoot);
}
const kc = Ar({
  attachResizeListener: (e, t) => Ge(e, "resize", t),
  measureScroll: () => {
    var e, t;
    return {
      x: document.documentElement.scrollLeft || ((e = document.body) == null ? void 0 : e.scrollLeft) || 0,
      y: document.documentElement.scrollTop || ((t = document.body) == null ? void 0 : t.scrollTop) || 0
    };
  },
  checkIsScrollRoot: () => !0
}), $t = {
  current: void 0
}, Vr = Ar({
  measureScroll: (e) => ({
    x: e.scrollLeft,
    y: e.scrollTop
  }),
  defaultParent: () => {
    if (!$t.current) {
      const e = new kc({});
      e.mount(window), e.setOptions({ layoutScroll: !0 }), $t.current = e;
    }
    return $t.current;
  },
  resetTransform: (e, t) => {
    e.style.transform = t !== void 0 ? t : "none";
  },
  checkIsScrollRoot: (e) => window.getComputedStyle(e).position === "fixed"
}), Wn = Le({
  transformPagePoint: (e) => e,
  isStatic: !1,
  reducedMotion: "never"
});
function Gs(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function Sc(...e) {
  return (t) => {
    let n = !1;
    const s = e.map((i) => {
      const a = Gs(i, t);
      return !n && typeof a == "function" && (n = !0), a;
    });
    if (n)
      return () => {
        for (let i = 0; i < s.length; i++) {
          const a = s[i];
          typeof a == "function" ? a() : Gs(e[i], null);
        }
      };
  };
}
function Cc(...e) {
  return pt.useCallback(Sc(...e), e);
}
class Mc extends pt.Component {
  getSnapshotBeforeUpdate(t) {
    const n = this.props.childRef.current;
    if (n && t.isPresent && !this.props.isPresent) {
      const s = n.offsetParent, i = sn(s) && s.offsetWidth || 0, a = sn(s) && s.offsetHeight || 0, r = this.props.sizeRef.current;
      r.height = n.offsetHeight || 0, r.width = n.offsetWidth || 0, r.top = n.offsetTop, r.left = n.offsetLeft, r.right = i - r.width - r.left, r.bottom = a - r.height - r.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function Pc({ children: e, isPresent: t, anchorX: n, anchorY: s, root: i }) {
  var h;
  const a = un(), r = B(null), o = B({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }), { nonce: c } = Y(Wn), u = ((h = e.props) == null ? void 0 : h.ref) ?? (e == null ? void 0 : e.ref), d = Cc(r, u);
  return hn(() => {
    const { width: f, height: m, top: p, left: g, right: y, bottom: w } = o.current;
    if (t || !r.current || !f || !m)
      return;
    const k = n === "left" ? `left: ${g}` : `right: ${y}`, S = s === "bottom" ? `bottom: ${w}` : `top: ${p}`;
    r.current.dataset.motionPopId = a;
    const v = document.createElement("style");
    c && (v.nonce = c);
    const x = i ?? document.head;
    return x.appendChild(v), v.sheet && v.sheet.insertRule(`
          [data-motion-pop-id="${a}"] {
            position: absolute !important;
            width: ${f}px !important;
            height: ${m}px !important;
            ${k}px !important;
            ${S}px !important;
          }
        `), () => {
      x.contains(v) && x.removeChild(v);
    };
  }, [t]), l(Mc, { isPresent: t, childRef: r, sizeRef: o, children: pt.cloneElement(e, { ref: d }) });
}
const Ac = ({ children: e, initial: t, isPresent: n, onExitComplete: s, custom: i, presenceAffectsLayout: a, mode: r, anchorX: o, anchorY: c, root: u }) => {
  const d = mn(Lc), h = un();
  let f = !0, m = ne(() => (f = !1, {
    id: h,
    initial: t,
    isPresent: n,
    custom: i,
    onExitComplete: (p) => {
      d.set(p, !0);
      for (const g of d.values())
        if (!g)
          return;
      s && s();
    },
    register: (p) => (d.set(p, !1), () => d.delete(p))
  }), [n, d, s]);
  return a && f && (m = { ...m }), ne(() => {
    d.forEach((p, g) => d.set(g, !1));
  }, [n]), pt.useEffect(() => {
    !n && !d.size && s && s();
  }, [n]), r === "popLayout" && (e = l(Pc, { isPresent: n, anchorX: o, anchorY: c, root: u, children: e })), l(yt.Provider, { value: m, children: e });
};
function Lc() {
  return /* @__PURE__ */ new Map();
}
function Dr(e = !0) {
  const t = Y(yt);
  if (t === null)
    return [!0, null];
  const { isPresent: n, onExitComplete: s, register: i } = t, a = un();
  H(() => {
    if (e)
      return i(a);
  }, [e]);
  const r = D(() => e && s && s(a), [a, s, e]);
  return !n && s ? [!1, r] : [!0];
}
const nt = (e) => e.key || "";
function Ys(e) {
  const t = [];
  return Gr.forEach(e, (n) => {
    Yr(n) && t.push(n);
  }), t;
}
const J = ({ children: e, custom: t, initial: n = !0, onExitComplete: s, presenceAffectsLayout: i = !0, mode: a = "sync", propagate: r = !1, anchorX: o = "left", anchorY: c = "top", root: u }) => {
  const [d, h] = Dr(r), f = ne(() => Ys(e), [e]), m = r && !d ? [] : f.map(nt), p = B(!0), g = B(f), y = mn(() => /* @__PURE__ */ new Map()), w = B(/* @__PURE__ */ new Set()), [k, S] = $(f), [v, x] = $(f);
  ui(() => {
    p.current = !1, g.current = f;
    for (let C = 0; C < v.length; C++) {
      const P = nt(v[C]);
      m.includes(P) ? (y.delete(P), w.current.delete(P)) : y.get(P) !== !0 && y.set(P, !1);
    }
  }, [v, m.length, m.join("-")]);
  const T = [];
  if (f !== k) {
    let C = [...f];
    for (let P = 0; P < v.length; P++) {
      const L = v[P], E = nt(L);
      m.includes(E) || (C.splice(P, 0, L), T.push(L));
    }
    return a === "wait" && T.length && (C = T), x(Ys(C)), S(f), null;
  }
  process.env.NODE_ENV !== "production" && a === "wait" && v.length > 1 && console.warn(`You're attempting to animate multiple children within AnimatePresence, but its mode is set to "wait". This will lead to odd visual behaviour.`);
  const { forceRender: N } = Y(fn);
  return l(be, { children: v.map((C) => {
    const P = nt(C), L = r && !d ? !1 : f === v || m.includes(P), E = () => {
      if (w.current.has(P))
        return;
      if (w.current.add(P), y.has(P))
        y.set(P, !0);
      else
        return;
      let G = !0;
      y.forEach((se) => {
        se || (G = !1);
      }), G && (N == null || N(), x(g.current), r && (h == null || h()), s && s());
    };
    return l(Ac, { isPresent: L, initial: !p.current || n ? void 0 : !1, custom: t, presenceAffectsLayout: i, mode: a, root: u, onExitComplete: L ? void 0 : E, anchorX: o, anchorY: c, children: C }, P);
  }) });
}, $r = Le({ strict: !1 }), Xs = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
};
let qs = !1;
function Vc() {
  if (qs)
    return;
  const e = {};
  for (const t in Xs)
    e[t] = {
      isEnabled: (n) => Xs[t].some((s) => !!n[s])
    };
  lr(e), qs = !0;
}
function Rr() {
  return Vc(), yl();
}
function Dc(e) {
  const t = Rr();
  for (const n in e)
    t[n] = {
      ...t[n],
      ...e[n]
    };
  lr(t);
}
const $c = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "ignoreStrict",
  "viewport"
]);
function mt(e) {
  return e.startsWith("while") || e.startsWith("drag") && e !== "draggable" || e.startsWith("layout") || e.startsWith("onTap") || e.startsWith("onPan") || e.startsWith("onLayout") || $c.has(e);
}
let Er = (e) => !mt(e);
function Rc(e) {
  typeof e == "function" && (Er = (t) => t.startsWith("on") ? !mt(t) : e(t));
}
try {
  Rc(require("@emotion/is-prop-valid").default);
} catch {
}
function Ec(e, t, n) {
  const s = {};
  for (const i in e)
    i === "values" && typeof e.values == "object" || (Er(i) || n === !0 && mt(i) || !t && !mt(i) || // If trying to use native HTML drag events, forward drag listeners
    e.draggable && i.startsWith("onDrag")) && (s[i] = e[i]);
  return s;
}
const bt = /* @__PURE__ */ Le({});
function Bc(e, t) {
  if (vt(e)) {
    const { initial: n, animate: s } = e;
    return {
      initial: n === !1 || Ke(n) ? n : void 0,
      animate: Ke(s) ? s : void 0
    };
  }
  return e.inherit !== !1 ? t : {};
}
function Ic(e) {
  const { initial: t, animate: n } = Bc(e, Y(bt));
  return ne(() => ({ initial: t, animate: n }), [Zs(t), Zs(n)]);
}
function Zs(e) {
  return Array.isArray(e) ? e.join(" ") : e;
}
const Hn = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function Br(e, t, n) {
  for (const s in t)
    !X(t[s]) && !pr(s, n) && (e[s] = t[s]);
}
function jc({ transformTemplate: e }, t) {
  return ne(() => {
    const n = Hn();
    return On(n, t, e), Object.assign({}, n.vars, n.style);
  }, [t]);
}
function Fc(e, t) {
  const n = e.style || {}, s = {};
  return Br(s, n, e), Object.assign(s, jc(e, t)), s;
}
function Oc(e, t) {
  const n = {}, s = Fc(e, t);
  return e.drag && e.dragListener !== !1 && (n.draggable = !1, s.userSelect = s.WebkitUserSelect = s.WebkitTouchCallout = "none", s.touchAction = e.drag === !0 ? "none" : `pan-${e.drag === "x" ? "y" : "x"}`), e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (n.tabIndex = 0), n.style = s, n;
}
const Ir = () => ({
  ...Hn(),
  attrs: {}
});
function zc(e, t, n, s) {
  const i = ne(() => {
    const a = Ir();
    return gr(a, t, xr(s), e.transformTemplate, e.style), {
      ...a.attrs,
      style: { ...a.style }
    };
  }, [t]);
  if (e.style) {
    const a = {};
    Br(a, e.style, e), i.style = { ...a, ...i.style };
  }
  return i;
}
const Wc = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function Un(e) {
  return (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof e != "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    e.includes("-") ? !1 : (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      !!(Wc.indexOf(e) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(e))
    )
  );
}
function Hc(e, t, n, { latestValues: s }, i, a = !1, r) {
  const c = (r ?? Un(e) ? zc : Oc)(t, s, i, e), u = Ec(t, typeof e == "string", a), d = e !== ci ? { ...u, ...c, ref: n } : {}, { children: h } = t, f = ne(() => X(h) ? h.get() : h, [h]);
  return Xr(e, {
    ...d,
    children: f
  });
}
function Uc({ scrapeMotionValuesFromProps: e, createRenderState: t }, n, s, i) {
  return {
    latestValues: _c(n, s, i, e),
    renderState: t()
  };
}
function _c(e, t, n, s) {
  const i = {}, a = s(e, {});
  for (const f in a)
    i[f] = at(a[f]);
  let { initial: r, animate: o } = e;
  const c = vt(e), u = or(e);
  t && u && !c && e.inherit !== !1 && (r === void 0 && (r = t.initial), o === void 0 && (o = t.animate));
  let d = n ? n.initial === !1 : !1;
  d = d || r === !1;
  const h = d ? o : r;
  if (h && typeof h != "boolean" && !xt(h)) {
    const f = Array.isArray(h) ? h : [h];
    for (let m = 0; m < f.length; m++) {
      const p = $n(e, f[m]);
      if (p) {
        const { transitionEnd: g, transition: y, ...w } = p;
        for (const k in w) {
          let S = w[k];
          if (Array.isArray(S)) {
            const v = d ? S.length - 1 : 0;
            S = S[v];
          }
          S !== null && (i[k] = S);
        }
        for (const k in g)
          i[k] = g[k];
      }
    }
  }
  return i;
}
const jr = (e) => (t, n) => {
  const s = Y(bt), i = Y(yt), a = () => Uc(e, t, s, i);
  return n ? a() : mn(a);
}, Kc = /* @__PURE__ */ jr({
  scrapeMotionValuesFromProps: zn,
  createRenderState: Hn
}), Gc = /* @__PURE__ */ jr({
  scrapeMotionValuesFromProps: vr,
  createRenderState: Ir
}), Yc = Symbol.for("motionComponentSymbol");
function Xc(e, t, n) {
  const s = B(n);
  hn(() => {
    s.current = n;
  });
  const i = B(null);
  return D((a) => {
    var o;
    a && ((o = e.onMount) == null || o.call(e, a)), t && (a ? t.mount(a) : t.unmount());
    const r = s.current;
    if (typeof r == "function")
      if (a) {
        const c = r(a);
        typeof c == "function" && (i.current = c);
      } else i.current ? (i.current(), i.current = null) : r(a);
    else r && (r.current = a);
  }, [t]);
}
const Fr = Le({});
function Fe(e) {
  return e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "current");
}
function qc(e, t, n, s, i, a) {
  var S, v;
  const { visualElement: r } = Y(bt), o = Y($r), c = Y(yt), u = Y(Wn), d = u.reducedMotion, h = u.skipAnimations, f = B(null), m = B(!1);
  s = s || o.renderer, !f.current && s && (f.current = s(e, {
    visualState: t,
    parent: r,
    props: n,
    presenceContext: c,
    blockInitialAnimation: c ? c.initial === !1 : !1,
    reducedMotionConfig: d,
    skipAnimations: h,
    isSVG: a
  }), m.current && f.current && (f.current.manuallyAnimateOnMount = !0));
  const p = f.current, g = Y(Fr);
  p && !p.projection && i && (p.type === "html" || p.type === "svg") && Zc(f.current, n, i, g);
  const y = B(!1);
  hn(() => {
    p && y.current && p.update(n, c);
  });
  const w = n[Yi], k = B(!!w && !((S = window.MotionHandoffIsComplete) != null && S.call(window, w)) && ((v = window.MotionHasOptimisedAnimation) == null ? void 0 : v.call(window, w)));
  return ui(() => {
    m.current = !0, p && (y.current = !0, window.MotionIsMounted = !0, p.updateFeatures(), p.scheduleRenderMicrotask(), k.current && p.animationState && p.animationState.animateChanges());
  }), H(() => {
    p && (!k.current && p.animationState && p.animationState.animateChanges(), k.current && (queueMicrotask(() => {
      var x;
      (x = window.MotionHandoffMarkAsComplete) == null || x.call(window, w);
    }), k.current = !1), p.enteringChildren = void 0);
  }), p;
}
function Zc(e, t, n, s) {
  const { layoutId: i, layout: a, drag: r, dragConstraints: o, layoutScroll: c, layoutRoot: u, layoutCrossfade: d } = t;
  e.projection = new n(e.latestValues, t["data-framer-portal-id"] ? void 0 : Or(e.parent)), e.projection.setOptions({
    layoutId: i,
    layout: a,
    alwaysMeasureLayout: !!r || o && Fe(o),
    visualElement: e,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof a == "string" ? a : "both",
    initialPromotionConfig: s,
    crossfade: d,
    layoutScroll: c,
    layoutRoot: u
  });
}
function Or(e) {
  if (e)
    return e.options.allowProjection !== !1 ? e.projection : Or(e.parent);
}
function Rt(e, { forwardMotionProps: t = !1, type: n } = {}, s, i) {
  s && Dc(s);
  const a = n ? n === "svg" : Un(e), r = a ? Gc : Kc;
  function o(u, d) {
    let h;
    const f = {
      ...Y(Wn),
      ...u,
      layoutId: Jc(u)
    }, { isStatic: m } = f, p = Ic(u), g = r(u, m);
    if (!m && di) {
      Qc(f, s);
      const y = ed(f);
      h = y.MeasureLayout, p.visualElement = qc(e, g, f, i, y.ProjectionNode, a);
    }
    return b(bt.Provider, { value: p, children: [h && p.visualElement ? l(h, { visualElement: p.visualElement, ...f }) : null, Hc(e, u, Xc(g, p.visualElement, d), g, m, t, a)] });
  }
  o.displayName = `motion.${typeof e == "string" ? e : `create(${e.displayName ?? e.name ?? ""})`}`;
  const c = qr(o);
  return c[Yc] = e, c;
}
function Jc({ layoutId: e }) {
  const t = Y(fn).id;
  return t && e !== void 0 ? t + "-" + e : e;
}
function Qc(e, t) {
  const n = Y($r).strict;
  if (process.env.NODE_ENV !== "production" && t && n) {
    const s = "You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
    e.ignoreStrict ? Ve(!1, s, "lazy-strict-mode") : ce(!1, s, "lazy-strict-mode");
  }
}
function ed(e) {
  const t = Rr(), { drag: n, layout: s } = t;
  if (!n && !s)
    return {};
  const i = { ...n, ...s };
  return {
    MeasureLayout: n != null && n.isEnabled(e) || s != null && s.isEnabled(e) ? i.MeasureLayout : void 0,
    ProjectionNode: i.ProjectionNode
  };
}
function td(e, t) {
  if (typeof Proxy > "u")
    return Rt;
  const n = /* @__PURE__ */ new Map(), s = (a, r) => Rt(a, r, e, t), i = (a, r) => (process.env.NODE_ENV !== "production" && vn(!1, "motion() is deprecated. Use motion.create() instead."), s(a, r));
  return new Proxy(i, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (a, r) => r === "create" ? s : (n.has(r) || n.set(r, Rt(r, void 0, e, t)), n.get(r))
  });
}
const nd = (e, t) => t.isSVG ?? Un(e) ? new Rl(t) : new Pl(t, {
  allowProjection: e !== ci
});
class sd extends pe {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(t) {
    super(t), t.animationState || (t.animationState = Fl(t));
  }
  updateAnimationControlsSubscription() {
    const { animate: t } = this.node.getProps();
    xt(t) && (this.unmountControls = t.subscribe(this.node));
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: t } = this.node.getProps(), { animate: n } = this.node.prevProps || {};
    t !== n && this.updateAnimationControlsSubscription();
  }
  unmount() {
    var t;
    this.node.animationState.reset(), (t = this.unmountControls) == null || t.call(this);
  }
}
let id = 0;
class rd extends pe {
  constructor() {
    super(...arguments), this.id = id++;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent: t, onExitComplete: n } = this.node.presenceContext, { isPresent: s } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || t === s)
      return;
    const i = this.node.animationState.setActive("exit", !t);
    n && !t && i.then(() => {
      n(this.id);
    });
  }
  mount() {
    const { register: t, onExitComplete: n } = this.node.presenceContext || {};
    n && n(this.id), t && (this.unmount = t(this.id));
  }
  unmount() {
  }
}
const ad = {
  animation: {
    Feature: sd
  },
  exit: {
    Feature: rd
  }
};
function Ze(e) {
  return {
    point: {
      x: e.pageX,
      y: e.pageY
    }
  };
}
const od = (e) => (t) => In(t) && e(t, Ze(t));
function We(e, t, n, s) {
  return Ge(e, t, od(n), s);
}
const zr = ({ current: e }) => e ? e.ownerDocument.defaultView : null, Js = (e, t) => Math.abs(e - t);
function ld(e, t) {
  const n = Js(e.x, t.x), s = Js(e.y, t.y);
  return Math.sqrt(n ** 2 + s ** 2);
}
const Qs = /* @__PURE__ */ new Set(["auto", "scroll"]);
class Wr {
  constructor(t, n, { transformPagePoint: s, contextWindow: i = window, dragSnapToOrigin: a = !1, distanceThreshold: r = 3, element: o } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.scrollPositions = /* @__PURE__ */ new Map(), this.removeScrollListeners = null, this.onElementScroll = (m) => {
      this.handleScroll(m.target);
    }, this.onWindowScroll = () => {
      this.handleScroll(window);
    }, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const m = Bt(this.lastMoveEventInfo, this.history), p = this.startEvent !== null, g = ld(m.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!p && !g)
        return;
      const { point: y } = m, { timestamp: w } = K;
      this.history.push({ ...y, timestamp: w });
      const { onStart: k, onMove: S } = this.handlers;
      p || (k && k(this.lastMoveEvent, m), this.startEvent = this.lastMoveEvent), S && S(this.lastMoveEvent, m);
    }, this.handlePointerMove = (m, p) => {
      this.lastMoveEvent = m, this.lastMoveEventInfo = Et(p, this.transformPagePoint), I.update(this.updatePoint, !0);
    }, this.handlePointerUp = (m, p) => {
      this.end();
      const { onEnd: g, onSessionEnd: y, resumeAnimation: w } = this.handlers;
      if ((this.dragSnapToOrigin || !this.startEvent) && w && w(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const k = Bt(m.type === "pointercancel" ? this.lastMoveEventInfo : Et(p, this.transformPagePoint), this.history);
      this.startEvent && g && g(m, k), y && y(m, k);
    }, !In(t))
      return;
    this.dragSnapToOrigin = a, this.handlers = n, this.transformPagePoint = s, this.distanceThreshold = r, this.contextWindow = i || window;
    const c = Ze(t), u = Et(c, this.transformPagePoint), { point: d } = u, { timestamp: h } = K;
    this.history = [{ ...d, timestamp: h }];
    const { onSessionStart: f } = n;
    f && f(t, Bt(u, this.history)), this.removeListeners = Ye(We(this.contextWindow, "pointermove", this.handlePointerMove), We(this.contextWindow, "pointerup", this.handlePointerUp), We(this.contextWindow, "pointercancel", this.handlePointerUp)), o && this.startScrollTracking(o);
  }
  /**
   * Start tracking scroll on ancestors and window.
   */
  startScrollTracking(t) {
    let n = t.parentElement;
    for (; n; ) {
      const s = getComputedStyle(n);
      (Qs.has(s.overflowX) || Qs.has(s.overflowY)) && this.scrollPositions.set(n, {
        x: n.scrollLeft,
        y: n.scrollTop
      }), n = n.parentElement;
    }
    this.scrollPositions.set(window, {
      x: window.scrollX,
      y: window.scrollY
    }), window.addEventListener("scroll", this.onElementScroll, {
      capture: !0,
      passive: !0
    }), window.addEventListener("scroll", this.onWindowScroll, {
      passive: !0
    }), this.removeScrollListeners = () => {
      window.removeEventListener("scroll", this.onElementScroll, {
        capture: !0
      }), window.removeEventListener("scroll", this.onWindowScroll);
    };
  }
  /**
   * Handle scroll compensation during drag.
   *
   * For element scroll: adjusts history origin since pageX/pageY doesn't change.
   * For window scroll: adjusts lastMoveEventInfo since pageX/pageY would change.
   */
  handleScroll(t) {
    const n = this.scrollPositions.get(t);
    if (!n)
      return;
    const s = t === window, i = s ? { x: window.scrollX, y: window.scrollY } : {
      x: t.scrollLeft,
      y: t.scrollTop
    }, a = { x: i.x - n.x, y: i.y - n.y };
    a.x === 0 && a.y === 0 || (s ? this.lastMoveEventInfo && (this.lastMoveEventInfo.point.x += a.x, this.lastMoveEventInfo.point.y += a.y) : this.history.length > 0 && (this.history[0].x -= a.x, this.history[0].y -= a.y), this.scrollPositions.set(t, i), I.update(this.updatePoint, !0));
  }
  updateHandlers(t) {
    this.handlers = t;
  }
  end() {
    this.removeListeners && this.removeListeners(), this.removeScrollListeners && this.removeScrollListeners(), this.scrollPositions.clear(), fe(this.updatePoint);
  }
}
function Et(e, t) {
  return t ? { point: t(e.point) } : e;
}
function ei(e, t) {
  return { x: e.x - t.x, y: e.y - t.y };
}
function Bt({ point: e }, t) {
  return {
    point: e,
    delta: ei(e, Hr(t)),
    offset: ei(e, cd(t)),
    velocity: dd(t, 0.1)
  };
}
function cd(e) {
  return e[0];
}
function Hr(e) {
  return e[e.length - 1];
}
function dd(e, t) {
  if (e.length < 2)
    return { x: 0, y: 0 };
  let n = e.length - 1, s = null;
  const i = Hr(e);
  for (; n >= 0 && (s = e[n], !(i.timestamp - s.timestamp > /* @__PURE__ */ ae(t))); )
    n--;
  if (!s)
    return { x: 0, y: 0 };
  const a = /* @__PURE__ */ ee(i.timestamp - s.timestamp);
  if (a === 0)
    return { x: 0, y: 0 };
  const r = {
    x: (i.x - s.x) / a,
    y: (i.y - s.y) / a
  };
  return r.x === 1 / 0 && (r.x = 0), r.y === 1 / 0 && (r.y = 0), r;
}
function ud(e, { min: t, max: n }, s) {
  return t !== void 0 && e < t ? e = s ? O(t, e, s.min) : Math.max(e, t) : n !== void 0 && e > n && (e = s ? O(n, e, s.max) : Math.min(e, n)), e;
}
function ti(e, t, n) {
  return {
    min: t !== void 0 ? e.min + t : void 0,
    max: n !== void 0 ? e.max + n - (e.max - e.min) : void 0
  };
}
function hd(e, { top: t, left: n, bottom: s, right: i }) {
  return {
    x: ti(e.x, n, i),
    y: ti(e.y, t, s)
  };
}
function ni(e, t) {
  let n = t.min - e.min, s = t.max - e.max;
  return t.max - t.min < e.max - e.min && ([n, s] = [s, n]), { min: n, max: s };
}
function fd(e, t) {
  return {
    x: ni(e.x, t.x),
    y: ni(e.y, t.y)
  };
}
function md(e, t) {
  let n = 0.5;
  const s = Z(e), i = Z(t);
  return i > s ? n = /* @__PURE__ */ He(t.min, t.max - s, e.min) : s > i && (n = /* @__PURE__ */ He(e.min, e.max - i, t.min)), le(0, 1, n);
}
function pd(e, t) {
  const n = {};
  return t.min !== void 0 && (n.min = t.min - e.min), t.max !== void 0 && (n.max = t.max - e.min), n;
}
const cn = 0.35;
function gd(e = cn) {
  return e === !1 ? e = 0 : e === !0 && (e = cn), {
    x: si(e, "left", "right"),
    y: si(e, "top", "bottom")
  };
}
function si(e, t, n) {
  return {
    min: ii(e, t),
    max: ii(e, n)
  };
}
function ii(e, t) {
  return typeof e == "number" ? e : e[t] || 0;
}
const yd = /* @__PURE__ */ new WeakMap();
class xd {
  constructor(t) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = U(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = t;
  }
  start(t, { snapToCursor: n = !1, distanceThreshold: s } = {}) {
    const { presenceContext: i } = this.visualElement;
    if (i && i.isPresent === !1)
      return;
    const a = (h) => {
      n ? (this.stopAnimation(), this.snapToCursor(Ze(h).point)) : this.pauseAnimation();
    }, r = (h, f) => {
      this.stopAnimation();
      const { drag: m, dragPropagation: p, onDragStart: g } = this.getProps();
      if (m && !p && (this.openDragLock && this.openDragLock(), this.openDragLock = nl(m), !this.openDragLock))
        return;
      this.latestPointerEvent = h, this.latestPanInfo = f, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), Q((w) => {
        let k = this.getAxisMotionValue(w).get() || 0;
        if (oe.test(k)) {
          const { projection: S } = this.visualElement;
          if (S && S.layout) {
            const v = S.layout.layoutBox[w];
            v && (k = Z(v) * (parseFloat(k) / 100));
          }
        }
        this.originPoint[w] = k;
      }), g && I.update(() => g(h, f), !1, !0), en(this.visualElement, "transform");
      const { animationState: y } = this.visualElement;
      y && y.setActive("whileDrag", !0);
    }, o = (h, f) => {
      this.latestPointerEvent = h, this.latestPanInfo = f;
      const { dragPropagation: m, dragDirectionLock: p, onDirectionLock: g, onDrag: y } = this.getProps();
      if (!m && !this.openDragLock)
        return;
      const { offset: w } = f;
      if (p && this.currentDirection === null) {
        this.currentDirection = vd(w), this.currentDirection !== null && g && g(this.currentDirection);
        return;
      }
      this.updateAxis("x", f.point, w), this.updateAxis("y", f.point, w), this.visualElement.render(), y && I.update(() => y(h, f), !1, !0);
    }, c = (h, f) => {
      this.latestPointerEvent = h, this.latestPanInfo = f, this.stop(h, f), this.latestPointerEvent = null, this.latestPanInfo = null;
    }, u = () => Q((h) => {
      var f;
      return this.getAnimationState(h) === "paused" && ((f = this.getAxisMotionValue(h).animation) == null ? void 0 : f.play());
    }), { dragSnapToOrigin: d } = this.getProps();
    this.panSession = new Wr(t, {
      onSessionStart: a,
      onStart: r,
      onMove: o,
      onSessionEnd: c,
      resumeAnimation: u
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: d,
      distanceThreshold: s,
      contextWindow: zr(this.visualElement),
      element: this.visualElement.current
    });
  }
  /**
   * @internal
   */
  stop(t, n) {
    const s = t || this.latestPointerEvent, i = n || this.latestPanInfo, a = this.isDragging;
    if (this.cancel(), !a || !i || !s)
      return;
    const { velocity: r } = i;
    this.startAnimation(r);
    const { onDragEnd: o } = this.getProps();
    o && I.postRender(() => o(s, i));
  }
  /**
   * @internal
   */
  cancel() {
    this.isDragging = !1;
    const { projection: t, animationState: n } = this.visualElement;
    t && (t.isAnimationBlocked = !1), this.endPanSession();
    const { dragPropagation: s } = this.getProps();
    !s && this.openDragLock && (this.openDragLock(), this.openDragLock = null), n && n.setActive("whileDrag", !1);
  }
  /**
   * Clean up the pan session without modifying other drag state.
   * This is used during unmount to ensure event listeners are removed
   * without affecting projection animations or drag locks.
   * @internal
   */
  endPanSession() {
    this.panSession && this.panSession.end(), this.panSession = void 0;
  }
  updateAxis(t, n, s) {
    const { drag: i } = this.getProps();
    if (!s || !st(t, i, this.currentDirection))
      return;
    const a = this.getAxisMotionValue(t);
    let r = this.originPoint[t] + s[t];
    this.constraints && this.constraints[t] && (r = ud(r, this.constraints[t], this.elastic[t])), a.set(r);
  }
  resolveConstraints() {
    var a;
    const { dragConstraints: t, dragElastic: n } = this.getProps(), s = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (a = this.visualElement.projection) == null ? void 0 : a.layout, i = this.constraints;
    t && Fe(t) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : t && s ? this.constraints = hd(s.layoutBox, t) : this.constraints = !1, this.elastic = gd(n), i !== this.constraints && s && this.constraints && !this.hasMutatedConstraints && Q((r) => {
      this.constraints !== !1 && this.getAxisMotionValue(r) && (this.constraints[r] = pd(s.layoutBox[r], this.constraints[r]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: t, onMeasureDragConstraints: n } = this.getProps();
    if (!t || !Fe(t))
      return !1;
    const s = t.current;
    ce(s !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.", "drag-constraints-ref");
    const { projection: i } = this.visualElement;
    if (!i || !i.layout)
      return !1;
    const a = Nl(s, i.root, this.visualElement.getTransformPagePoint());
    let r = fd(i.layout.layoutBox, a);
    if (n) {
      const o = n(vl(r));
      this.hasMutatedConstraints = !!o, o && (r = dr(o));
    }
    return r;
  }
  startAnimation(t) {
    const { drag: n, dragMomentum: s, dragElastic: i, dragTransition: a, dragSnapToOrigin: r, onDragTransitionEnd: o } = this.getProps(), c = this.constraints || {}, u = Q((d) => {
      if (!st(d, n, this.currentDirection))
        return;
      let h = c && c[d] || {};
      r && (h = { min: 0, max: 0 });
      const f = i ? 200 : 1e6, m = i ? 40 : 1e7, p = {
        type: "inertia",
        velocity: s ? t[d] : 0,
        bounceStiffness: f,
        bounceDamping: m,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...a,
        ...h
      };
      return this.startAxisValueAnimation(d, p);
    });
    return Promise.all(u).then(o);
  }
  startAxisValueAnimation(t, n) {
    const s = this.getAxisMotionValue(t);
    return en(this.visualElement, t), s.start(Dn(t, s, 0, n, this.visualElement, !1));
  }
  stopAnimation() {
    Q((t) => this.getAxisMotionValue(t).stop());
  }
  pauseAnimation() {
    Q((t) => {
      var n;
      return (n = this.getAxisMotionValue(t).animation) == null ? void 0 : n.pause();
    });
  }
  getAnimationState(t) {
    var n;
    return (n = this.getAxisMotionValue(t).animation) == null ? void 0 : n.state;
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(t) {
    const n = `_drag${t.toUpperCase()}`, s = this.visualElement.getProps(), i = s[n];
    return i || this.visualElement.getValue(t, (s.initial ? s.initial[t] : void 0) || 0);
  }
  snapToCursor(t) {
    Q((n) => {
      const { drag: s } = this.getProps();
      if (!st(n, s, this.currentDirection))
        return;
      const { projection: i } = this.visualElement, a = this.getAxisMotionValue(n);
      if (i && i.layout) {
        const { min: r, max: o } = i.layout.layoutBox[n], c = a.get() || 0;
        a.set(t[n] - O(r, o, 0.5) + c);
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: t, dragConstraints: n } = this.getProps(), { projection: s } = this.visualElement;
    if (!Fe(n) || !s || !this.constraints)
      return;
    this.stopAnimation();
    const i = { x: 0, y: 0 };
    Q((r) => {
      const o = this.getAxisMotionValue(r);
      if (o && this.constraints !== !1) {
        const c = o.get();
        i[r] = md({ min: c, max: c }, this.constraints[r]);
      }
    });
    const { transformTemplate: a } = this.visualElement.getProps();
    this.visualElement.current.style.transform = a ? a({}, "") : "none", s.root && s.root.updateScroll(), s.updateLayout(), this.resolveConstraints(), Q((r) => {
      if (!st(r, t, null))
        return;
      const o = this.getAxisMotionValue(r), { min: c, max: u } = this.constraints[r];
      o.set(O(c, u, i[r]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    yd.set(this.visualElement, this);
    const t = this.visualElement.current, n = We(t, "pointerdown", (c) => {
      const { drag: u, dragListener: d = !0 } = this.getProps(), h = c.target, f = h !== t && ol(h);
      u && d && !f && this.start(c);
    }), s = () => {
      const { dragConstraints: c } = this.getProps();
      Fe(c) && c.current && (this.constraints = this.resolveRefConstraints());
    }, { projection: i } = this.visualElement, a = i.addEventListener("measure", s);
    i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), I.read(s);
    const r = Ge(window, "resize", () => this.scalePositionWithinConstraints()), o = i.addEventListener("didUpdate", (({ delta: c, hasLayoutChanged: u }) => {
      this.isDragging && u && (Q((d) => {
        const h = this.getAxisMotionValue(d);
        h && (this.originPoint[d] += c[d].translate, h.set(h.get() + c[d].translate));
      }), this.visualElement.render());
    }));
    return () => {
      r(), n(), a(), o && o();
    };
  }
  getProps() {
    const t = this.visualElement.getProps(), { drag: n = !1, dragDirectionLock: s = !1, dragPropagation: i = !1, dragConstraints: a = !1, dragElastic: r = cn, dragMomentum: o = !0 } = t;
    return {
      ...t,
      drag: n,
      dragDirectionLock: s,
      dragPropagation: i,
      dragConstraints: a,
      dragElastic: r,
      dragMomentum: o
    };
  }
}
function st(e, t, n) {
  return (t === !0 || t === e) && (n === null || n === e);
}
function vd(e, t = 10) {
  let n = null;
  return Math.abs(e.y) > t ? n = "y" : Math.abs(e.x) > t && (n = "x"), n;
}
class bd extends pe {
  constructor(t) {
    super(t), this.removeGroupControls = te, this.removeListeners = te, this.controls = new xd(t);
  }
  mount() {
    const { dragControls: t } = this.node.getProps();
    t && (this.removeGroupControls = t.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || te;
  }
  update() {
    const { dragControls: t } = this.node.getProps(), { dragControls: n } = this.node.prevProps || {};
    t !== n && (this.removeGroupControls(), t && (this.removeGroupControls = t.subscribe(this.controls)));
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners(), this.controls.isDragging || this.controls.endPanSession();
  }
}
const It = (e) => (t, n) => {
  e && I.update(() => e(t, n), !1, !0);
};
class wd extends pe {
  constructor() {
    super(...arguments), this.removePointerDownListener = te;
  }
  onPointerDown(t) {
    this.session = new Wr(t, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: zr(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: t, onPanStart: n, onPan: s, onPanEnd: i } = this.node.getProps();
    return {
      onSessionStart: It(t),
      onStart: It(n),
      onMove: It(s),
      onEnd: (a, r) => {
        delete this.session, i && I.postRender(() => i(a, r));
      }
    };
  }
  mount() {
    this.removePointerDownListener = We(this.node.current, "pointerdown", (t) => this.onPointerDown(t));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
let jt = !1;
class Nd extends Zr {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: t, layoutGroup: n, switchLayoutGroup: s, layoutId: i } = this.props, { projection: a } = t;
    a && (n.group && n.group.add(a), s && s.register && i && s.register(a), jt && a.root.didUpdate(), a.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), a.setOptions({
      ...a.options,
      layoutDependency: this.props.layoutDependency,
      onExitComplete: () => this.safeToRemove()
    })), ot.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(t) {
    const { layoutDependency: n, visualElement: s, drag: i, isPresent: a } = this.props, { projection: r } = s;
    return r && (r.isPresent = a, t.layoutDependency !== n && r.setOptions({
      ...r.options,
      layoutDependency: n
    }), jt = !0, i || t.layoutDependency !== n || n === void 0 || t.isPresent !== a ? r.willUpdate() : this.safeToRemove(), t.isPresent !== a && (a ? r.promote() : r.relegate() || I.postRender(() => {
      const o = r.getStack();
      (!o || !o.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection: t } = this.props.visualElement;
    t && (t.root.didUpdate(), Bn.postRender(() => {
      !t.currentAnimation && t.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: t, layoutGroup: n, switchLayoutGroup: s } = this.props, { projection: i } = t;
    jt = !0, i && (i.scheduleCheckAfterUnmount(), n && n.group && n.group.remove(i), s && s.deregister && s.deregister(i));
  }
  safeToRemove() {
    const { safeToRemove: t } = this.props;
    t && t();
  }
  render() {
    return null;
  }
}
function Ur(e) {
  const [t, n] = Dr(), s = Y(fn);
  return l(Nd, { ...e, layoutGroup: s, switchLayoutGroup: Y(Fr), isPresent: t, safeToRemove: n });
}
const Td = {
  pan: {
    Feature: wd
  },
  drag: {
    Feature: bd,
    ProjectionNode: Vr,
    MeasureLayout: Ur
  }
};
function ri(e, t, n) {
  const { props: s } = e;
  e.animationState && s.whileHover && e.animationState.setActive("whileHover", n === "Start");
  const i = "onHover" + n, a = s[i];
  a && I.postRender(() => a(t, Ze(t)));
}
class kd extends pe {
  mount() {
    const { current: t } = this.node;
    t && (this.unmount = sl(t, (n, s) => (ri(this.node, s, "Start"), (i) => ri(this.node, i, "End"))));
  }
  unmount() {
  }
}
class Sd extends pe {
  constructor() {
    super(...arguments), this.isActive = !1;
  }
  onFocus() {
    let t = !1;
    try {
      t = this.node.current.matches(":focus-visible");
    } catch {
      t = !0;
    }
    !t || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
  }
  onBlur() {
    !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
  }
  mount() {
    this.unmount = Ye(Ge(this.node.current, "focus", () => this.onFocus()), Ge(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function ai(e, t, n) {
  const { props: s } = e;
  if (e.current instanceof HTMLButtonElement && e.current.disabled)
    return;
  e.animationState && s.whileTap && e.animationState.setActive("whileTap", n === "Start");
  const i = "onTap" + (n === "End" ? "" : n), a = s[i];
  a && I.postRender(() => a(t, Ze(t)));
}
class Cd extends pe {
  mount() {
    const { current: t } = this.node;
    t && (this.unmount = cl(t, (n, s) => (ai(this.node, s, "Start"), (i, { success: a }) => ai(this.node, i, a ? "End" : "Cancel")), { useGlobalTarget: this.node.props.globalTapTarget }));
  }
  unmount() {
  }
}
const dn = /* @__PURE__ */ new WeakMap(), Ft = /* @__PURE__ */ new WeakMap(), Md = (e) => {
  const t = dn.get(e.target);
  t && t(e);
}, Pd = (e) => {
  e.forEach(Md);
};
function Ad({ root: e, ...t }) {
  const n = e || document;
  Ft.has(n) || Ft.set(n, {});
  const s = Ft.get(n), i = JSON.stringify(t);
  return s[i] || (s[i] = new IntersectionObserver(Pd, { root: e, ...t })), s[i];
}
function Ld(e, t, n) {
  const s = Ad(t);
  return dn.set(e, n), s.observe(e), () => {
    dn.delete(e), s.unobserve(e);
  };
}
const Vd = {
  some: 0,
  all: 1
};
class Dd extends pe {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport: t = {} } = this.node.getProps(), { root: n, margin: s, amount: i = "some", once: a } = t, r = {
      root: n ? n.current : void 0,
      rootMargin: s,
      threshold: typeof i == "number" ? i : Vd[i]
    }, o = (c) => {
      const { isIntersecting: u } = c;
      if (this.isInView === u || (this.isInView = u, a && !u && this.hasEnteredView))
        return;
      u && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", u);
      const { onViewportEnter: d, onViewportLeave: h } = this.node.getProps(), f = u ? d : h;
      f && f(c);
    };
    return Ld(this.node.current, r, o);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: t, prevProps: n } = this.node;
    ["amount", "margin", "root"].some($d(t, n)) && this.startObserver();
  }
  unmount() {
  }
}
function $d({ viewport: e = {} }, { viewport: t = {} } = {}) {
  return (n) => e[n] !== t[n];
}
const Rd = {
  inView: {
    Feature: Dd
  },
  tap: {
    Feature: Cd
  },
  focus: {
    Feature: Sd
  },
  hover: {
    Feature: kd
  }
}, Ed = {
  layout: {
    ProjectionNode: Vr,
    MeasureLayout: Ur
  }
}, Bd = {
  ...ad,
  ...Rd,
  ...Td,
  ...Ed
}, M = /* @__PURE__ */ td(Bd, nd), Id = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}, Ru = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}, Eu = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}, Bu = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: "easeOut" }
  }
}, Iu = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" }
  }
}, Ee = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0
    }
  }
}, Je = {
  hidden: { opacity: 0, y: 5, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
}, ju = {
  type: "spring",
  stiffness: 300,
  damping: 30
}, jd = {
  rotate: [0, 90, 90, 180, 180, 270, 270, 360],
  transition: {
    duration: 2,
    repeat: 1 / 0,
    ease: [0.4, 0, 0.2, 1],
    times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 1]
  }
}, Fd = {
  rotate: 0,
  transition: { duration: 0.3, ease: "easeOut" }
}, Fu = {
  initial: { scale: 1, opacity: 0.5 },
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: 1 / 0,
      ease: "easeInOut"
    }
  }
}, _r = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
}, wt = {
  hidden: { opacity: 0, y: 15, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
}, Od = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}, zd = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: "easeIn" }
  }
}, Wd = {
  xs: "w-4 h-4",
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-10 h-10"
}, Nt = ({
  size: e = "md",
  animate: t = "none",
  color: n = "#009E5C",
  className: s = "",
  isPaused: i = !1
}) => {
  const a = "M12 12L14.25 3H21V9.75L12 12L21 14.25V21H14.25L12 12L9.75001 21H3.00001V14.25L12 12L3.00001 9.75V3H9.75001L12 12Z", r = t === "rotate" && !i, o = t === "pulse" && !i;
  return /* @__PURE__ */ l(
    M.div,
    {
      className: `shrink-0 ${Wd[e]} ${s}`,
      animate: r ? jd : o ? {
        scale: [1, 1.1, 1],
        opacity: [1, 0.8, 1],
        transition: {
          duration: 1.5,
          repeat: 1 / 0,
          ease: "easeInOut"
        }
      } : Fd,
      children: /* @__PURE__ */ l(
        "svg",
        {
          className: "block w-full h-full",
          fill: "none",
          preserveAspectRatio: "xMidYMid meet",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ l("path", { d: a, fill: n })
        }
      )
    }
  );
}, Hd = {
  xs: { container: "w-5 h-5", text: "text-[10px]" },
  sm: { container: "w-6 h-6", text: "text-xs" },
  md: { container: "w-8 h-8", text: "text-sm" },
  lg: { container: "w-10 h-10", text: "text-base" },
  xl: { container: "w-12 h-12", text: "text-lg" }
}, Ud = {
  user: "bg-blue-100 text-blue-700",
  assistant: "bg-emerald-100 text-emerald-700"
}, _d = ({
  src: e,
  fallback: t,
  alt: n = "",
  size: s = "md",
  variant: i = "user",
  className: a = "",
  onClick: r
}) => {
  const [o, c] = $(!1), u = !e || o, { container: d, text: h } = Hd[s], f = (t == null ? void 0 : t.slice(0, 2).toUpperCase()) || "?";
  return /* @__PURE__ */ l(
    "div",
    {
      className: `
        ${d}
        shrink-0 rounded-full overflow-hidden
        flex items-center justify-center
        ${u ? Ud[i] : ""}
        ${r ? "cursor-pointer hover:opacity-90 transition-opacity" : ""}
        ${a}
      `,
      onClick: r,
      role: r ? "button" : void 0,
      tabIndex: r ? 0 : void 0,
      onKeyDown: r ? (m) => {
        (m.key === "Enter" || m.key === " ") && (m.preventDefault(), r());
      } : void 0,
      children: u ? /* @__PURE__ */ l("span", { className: `${h} font-medium select-none`, children: f }) : /* @__PURE__ */ l(
        "img",
        {
          src: e,
          alt: n,
          className: "w-full h-full object-cover",
          onError: () => c(!0)
        }
      )
    }
  );
}, Ou = ({
  content: e,
  speed: t = 10,
  style: n = "basic",
  onComplete: s,
  className: i = "",
  inheritStyles: a = !1,
  glowIntensity: r = 70,
  trailLength: o = 8,
  isPaused: c = !1
}) => {
  const u = r / 100, [d, h] = $(0), f = B(), m = B(), p = B(0), g = B(!1), y = ne(() => e ? e.split(/(\*\*.*?\*\*)/g).map((N) => N.startsWith("**") && N.endsWith("**") ? { text: N.slice(2, -2), isBold: !0 } : { text: N, isBold: !1 }).filter((N) => N.text.length > 0) : [], [e]), w = ne(
    () => y.reduce((T, N) => T + N.text.length, 0),
    [y]
  );
  H(() => {
    h(0), m.current = void 0, p.current = 0, g.current = !1;
  }, [e]), H(() => {
    if (c) {
      p.current = d, f.current && cancelAnimationFrame(f.current);
      return;
    }
    const T = (N) => {
      m.current || (m.current = N - p.current * t);
      const C = N - m.current, P = Math.floor(C / t);
      if (P >= w) {
        h(w), s && !g.current && (g.current = !0, s());
        return;
      }
      h(P), f.current = requestAnimationFrame(T);
    };
    return f.current = requestAnimationFrame(T), () => {
      f.current && cancelAnimationFrame(f.current);
    };
  }, [w, t, s, c, d]);
  const k = d >= w, S = (T) => {
    if (T >= o) return {};
    const C = Math.max(0, 1 - T / Math.max(1, o - 1)), P = (0.5 + C * 0.5) * u, L = C * 0.5 * u, E = C * 0.2 * u, G = C * 8 * 0.5, se = C * 8, _ = C * 0.4 * 8;
    return {
      display: "inline-block",
      color: `rgba(16, 185, 129, ${P})`,
      textShadow: `0 0 ${G}px rgba(52, 211, 153, ${L}), 0 0 ${se}px rgba(16, 185, 129, ${E})`,
      filter: `blur(${_}px)`,
      transition: "color 0.3s ease-out, text-shadow 0.3s ease-out, filter 0.3s ease-out"
    };
  }, v = (T) => {
    if (T >= o) return {};
    const C = Math.max(0, 1 - T / Math.max(1, o - 1)), P = 2 * u, L = 0.5 * u;
    return {
      display: "inline-block",
      transform: `translateY(${-C * P}px)`,
      opacity: 0.7 + C * 0.3,
      filter: `blur(${C * L}px)`,
      transition: "transform 0.25s ease-out, filter 0.25s ease-out, opacity 0.25s ease-out"
    };
  }, x = () => {
    if (k && e)
      return y.map((P, L) => /* @__PURE__ */ l(
        "span",
        {
          className: a ? P.isBold ? "font-bold" : "" : P.isBold ? "font-semibold text-slate-900" : "font-normal text-slate-600",
          children: P.text
        },
        L
      ));
    let T = 0, N = 0;
    const C = [];
    for (let P = 0; P < y.length; P++) {
      const L = y[P], E = T, G = T + L.text.length;
      if (d <= E) break;
      const se = Math.min(d, G) - E, _ = L.text.slice(0, se);
      if ((n === "glow" || n === "gradient") && !k) {
        const Qe = _.split("").map((V, R) => {
          const j = N + R, z = d - 1 - j, Ne = n === "glow" ? S(z) : v(z);
          return /* @__PURE__ */ l(
            "span",
            {
              style: Ne,
              className: a ? L.isBold ? "font-bold" : "" : L.isBold ? "font-semibold" : "font-normal",
              children: V === " " ? " " : V
            },
            `${P}-${R}`
          );
        });
        C.push(
          /* @__PURE__ */ l("span", { className: n === "gradient" ? "text-emerald-500" : "", children: Qe }, P)
        ), N += se;
      } else
        C.push(
          /* @__PURE__ */ l(
            "span",
            {
              className: a ? L.isBold ? "font-bold" : "" : L.isBold ? "font-semibold text-slate-900" : "font-normal text-slate-600",
              children: _
            },
            P
          )
        );
      if (T += L.text.length, d < G) break;
    }
    return n === "typewriter" && !k && C.push(
      /* @__PURE__ */ l(
        "span",
        {
          className: "inline-block w-[2px] h-[1em] bg-slate-600 ml-[1px] align-middle",
          style: {
            animation: "blade-ai-typing 1s ease-in-out infinite"
          }
        },
        "cursor"
      )
    ), C;
  };
  return /* @__PURE__ */ l(
    "span",
    {
      className: `${a ? "inline" : "inline text-[15px] leading-[1.6]"} ${i}`,
      children: x()
    }
  );
}, zu = ({
  content: e,
  highlightPatterns: t = [],
  className: n = "",
  applyDefaultStyles: s = !0
}) => {
  const i = ne(() => {
    if (!e) return null;
    let a = e;
    const r = [];
    t.forEach((u, d) => {
      Array.from(e.matchAll(u.pattern)).forEach((f, m) => {
        if (f.index !== void 0) {
          const p = `__HIGHLIGHT_${d}_${m}__`;
          r.push({
            start: f.index,
            end: f.index + f[0].length,
            replacement: p,
            className: u.className
          });
        }
      });
    });
    const o = (u) => {
      var m;
      const d = [];
      let h = u, f = 0;
      for (; h.length > 0; ) {
        const p = h.match(/__HIGHLIGHT_(\d+)_(\d+)__/);
        if (p && p.index === 0) {
          const v = parseInt(p[1]), x = parseInt(p[2]), T = t[v], C = ((m = Array.from(e.matchAll(T.pattern))[x]) == null ? void 0 : m[0]) || "";
          T.render ? d.push(
            /* @__PURE__ */ l(gt.Fragment, { children: T.render(C, x) }, f++)
          ) : d.push(
            /* @__PURE__ */ l("span", { className: T.className, children: C }, f++)
          ), h = h.slice(p[0].length);
          continue;
        }
        const g = h.match(/^\*\*(.+?)\*\*/);
        if (g) {
          d.push(
            /* @__PURE__ */ l("strong", { className: "font-semibold text-slate-900", children: o(g[1]) }, f++)
          ), h = h.slice(g[0].length);
          continue;
        }
        const y = h.match(/^(?:\*([^*]+)\*|_([^_]+)_)/);
        if (y) {
          d.push(
            /* @__PURE__ */ l("em", { className: "italic", children: o(y[1] || y[2]) }, f++)
          ), h = h.slice(y[0].length);
          continue;
        }
        const w = h.match(/^`([^`]+)`/);
        if (w) {
          d.push(
            /* @__PURE__ */ l(
              "code",
              {
                className: "bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-800",
                children: w[1]
              },
              f++
            )
          ), h = h.slice(w[0].length);
          continue;
        }
        const k = h.match(/^\[([^\]]+)\]\(([^)]+)\)/);
        if (k) {
          d.push(
            /* @__PURE__ */ l(
              "a",
              {
                href: k[2],
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-blue-600 hover:underline",
                children: o(k[1])
              },
              f++
            )
          ), h = h.slice(k[0].length);
          continue;
        }
        if (h.startsWith(`
`)) {
          d.push(/* @__PURE__ */ l("br", {}, f++)), h = h.slice(1);
          continue;
        }
        const S = h.search(/\*\*|\*|_|`|\[|__HIGHLIGHT_|\n/);
        if (S === -1) {
          d.push(h);
          break;
        } else S === 0 ? (d.push(h[0]), h = h.slice(1)) : (d.push(h.slice(0, S)), h = h.slice(S));
      }
      return d;
    };
    return ((u) => {
      const d = u.split(`
`), h = [];
      let f = 0, m = [];
      const p = () => {
        m.length > 0 && (h.push(
          /* @__PURE__ */ l("p", { className: "mb-3 last:mb-0", children: o(m.join(`
`)) }, f++)
        ), m = []);
      };
      return d.forEach((g) => {
        const y = g.trim(), w = y.match(/^(#{1,6})\s+(.+)$/);
        if (w) {
          p();
          const x = w[1].length, T = `h${x}`, N = {
            1: "text-2xl font-bold mb-4",
            2: "text-xl font-semibold mb-3",
            3: "text-lg font-semibold mb-2",
            4: "text-base font-semibold mb-2",
            5: "text-sm font-semibold mb-1",
            6: "text-sm font-medium mb-1"
          };
          h.push(
            /* @__PURE__ */ l(T, { className: N[x] || "", children: o(w[2]) }, f++)
          );
          return;
        }
        const k = y.match(/^[-*]\s+(.+)$/);
        if (k) {
          p(), h.push(
            /* @__PURE__ */ l("li", { className: "ml-4 list-disc mb-1", children: o(k[1]) }, f++)
          );
          return;
        }
        const S = y.match(/^(\d+)\.\s+(.+)$/);
        if (S) {
          p(), h.push(
            /* @__PURE__ */ l("li", { className: "ml-4 list-decimal mb-1", children: o(S[2]) }, f++)
          );
          return;
        }
        const v = y.match(/^>\s*(.*)$/);
        if (v) {
          p(), h.push(
            /* @__PURE__ */ l(
              "blockquote",
              {
                className: "border-l-3 border-slate-300 pl-4 text-slate-600 italic my-2",
                children: o(v[1])
              },
              f++
            )
          );
          return;
        }
        if (/^[-*_]{3,}$/.test(y)) {
          p(), h.push(/* @__PURE__ */ l("hr", { className: "my-4 border-slate-200" }, f++));
          return;
        }
        if (y === "") {
          p();
          return;
        }
        m.push(g);
      }), p(), h;
    })(a);
  }, [e, t]);
  return /* @__PURE__ */ l("div", { className: `${s ? "blade-ai-markdown" : ""} ${n}`, children: i });
}, Wu = ({ content: e, className: t = "" }) => {
  const n = ne(() => e ? e.split(/(\*\*.*?\*\*)/g).map((i, a) => i.startsWith("**") && i.endsWith("**") ? /* @__PURE__ */ l("strong", { className: "font-semibold text-slate-900", children: i.slice(2, -2) }, a) : /* @__PURE__ */ l("span", { children: i }, a)) : null, [e]);
  return /* @__PURE__ */ l("span", { className: t, children: n });
}, Kd = {
  sm: "max-w-lg",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-full"
}, Gd = {
  default: "bg-white",
  subtle: "bg-slate-50",
  transparent: "bg-transparent"
}, Hu = ({
  children: e,
  className: t = "",
  maxWidth: n = "lg",
  background: s = "default"
}) => /* @__PURE__ */ l(
  "div",
  {
    className: `
        blade-ai-reset blade-ai-text
        flex flex-col h-full w-full
        ${Gd[s]}
        ${t}
      `,
    children: /* @__PURE__ */ l(
      "div",
      {
        className: `
          flex flex-col h-full w-full mx-auto
          ${Kd[n]}
        `,
        children: e
      }
    )
  }
), Yd = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6"
};
function Uu({
  messages: e,
  renderMessage: t,
  onScroll: n,
  autoScroll: s = !0,
  autoScrollThreshold: i = 100,
  className: a = "",
  gap: r = "md",
  animate: o = !0
}) {
  const c = B(null), u = B(!0), d = D(() => {
    const m = c.current;
    if (!m) return !0;
    const { scrollTop: p, scrollHeight: g, clientHeight: y } = m;
    return g - p - y < i;
  }, [i]), h = D((m = !0) => {
    const p = c.current;
    p && p.scrollTo({
      top: p.scrollHeight,
      behavior: m ? "smooth" : "auto"
    });
  }, []), f = (m) => {
    u.current = d(), n == null || n(m);
  };
  return H(() => {
    s && u.current && h();
  }, [e.length, s, h]), H(() => {
    e.length > 0 && h(!1);
  }, []), /* @__PURE__ */ l(
    "div",
    {
      ref: c,
      onScroll: f,
      className: `
        flex-1 overflow-y-auto overflow-x-hidden
        blade-ai-scrollbar
        ${a}
      `,
      children: /* @__PURE__ */ l(
        M.div,
        {
          className: `flex flex-col ${Yd[r]} p-4`,
          variants: o ? Ee : void 0,
          initial: o ? "hidden" : void 0,
          animate: o ? "visible" : void 0,
          children: /* @__PURE__ */ l(J, { mode: "popLayout", children: e.map((m, p) => {
            const g = p === e.length - 1;
            return o ? /* @__PURE__ */ l(
              M.div,
              {
                variants: Je,
                layout: !0,
                layoutId: m.id,
                children: t(m, p, g)
              },
              m.id
            ) : /* @__PURE__ */ l("div", { children: t(m, p, g) }, m.id);
          }) })
        }
      )
    }
  );
}
const _u = ({
  content: e,
  timestamp: t,
  attachments: n = [],
  avatarSrc: s,
  avatarFallback: i = "U",
  showAvatar: a = !0,
  className: r = "",
  animate: o = !0
}) => {
  const c = (h) => (typeof h == "string" ? new Date(h) : h).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), u = o ? M.div : "div", d = o ? { variants: _r, initial: "hidden", animate: "visible" } : {};
  return /* @__PURE__ */ b(
    u,
    {
      className: `flex justify-end gap-3 ${r}`,
      ...d,
      children: [
        /* @__PURE__ */ b("div", { className: "flex flex-col items-end max-w-[80%]", children: [
          n.length > 0 && /* @__PURE__ */ l("div", { className: "flex flex-wrap gap-2 mb-2 justify-end", children: n.map((h) => /* @__PURE__ */ l(
            "div",
            {
              className: "flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg text-sm",
              children: h.type === "image" && h.preview ? /* @__PURE__ */ l(
                "img",
                {
                  src: h.preview,
                  alt: h.filename,
                  className: "w-16 h-16 object-cover rounded"
                }
              ) : /* @__PURE__ */ b(be, { children: [
                /* @__PURE__ */ l(
                  "svg",
                  {
                    className: "w-4 h-4 text-slate-500",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    children: /* @__PURE__ */ l(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ l("span", { className: "text-slate-700 truncate max-w-[150px]", children: h.filename })
              ] })
            },
            h.id
          )) }),
          /* @__PURE__ */ l(
            "div",
            {
              className: `
            px-4 py-3 rounded-2xl rounded-tr-md
            bg-[#e6eafa] text-[#192839]
            text-[15px] leading-relaxed
          `,
              children: e
            }
          ),
          t && /* @__PURE__ */ l("span", { className: "text-xs text-slate-400 mt-1 mr-1", children: c(t) })
        ] }),
        a && /* @__PURE__ */ l(
          _d,
          {
            src: s,
            fallback: i,
            variant: "user",
            size: "sm",
            className: "mt-1"
          }
        )
      ]
    }
  );
}, Ku = ({
  children: e,
  isThinking: t = !1,
  isLast: n = !1,
  showLogo: s = !0,
  logoColor: i,
  className: a = "",
  animate: r = !0,
  timestamp: o
}) => {
  const c = (h) => (typeof h == "string" ? new Date(h) : h).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), u = r ? M.div : "div", d = r ? { variants: _r, initial: "hidden", animate: "visible" } : {};
  return /* @__PURE__ */ b(
    u,
    {
      className: `flex gap-3 ${a}`,
      ...d,
      children: [
        s && /* @__PURE__ */ l("div", { className: "shrink-0 mt-1", children: /* @__PURE__ */ l(
          Nt,
          {
            size: "md",
            animate: t ? "rotate" : "none",
            color: i
          }
        ) }),
        /* @__PURE__ */ b("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ l(
            "div",
            {
              className: `
            text-[15px] leading-relaxed text-[#192839]
          `,
              children: e
            }
          ),
          o && !t && /* @__PURE__ */ l("span", { className: "text-xs text-slate-400 mt-2 block", children: c(o) })
        ] })
      ]
    }
  );
}, Xd = {
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    icon: "text-blue-500"
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    icon: "text-amber-500"
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    icon: "text-red-500"
  },
  success: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    icon: "text-emerald-500"
  }
}, qd = {
  info: /* @__PURE__ */ l("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
    "path",
    {
      fillRule: "evenodd",
      d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
      clipRule: "evenodd"
    }
  ) }),
  warning: /* @__PURE__ */ l("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
    "path",
    {
      fillRule: "evenodd",
      d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
      clipRule: "evenodd"
    }
  ) }),
  error: /* @__PURE__ */ l("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
    "path",
    {
      fillRule: "evenodd",
      d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
      clipRule: "evenodd"
    }
  ) }),
  success: /* @__PURE__ */ l("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
    "path",
    {
      fillRule: "evenodd",
      d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
      clipRule: "evenodd"
    }
  ) })
}, Gu = ({
  content: e,
  variant: t = "info",
  showIcon: n = !0,
  className: s = "",
  animate: i = !0,
  dismissible: a = !1,
  onDismiss: r
}) => {
  const o = Xd[t], c = i ? M.div : "div", u = i ? { variants: Id, initial: "hidden", animate: "visible" } : {};
  return /* @__PURE__ */ l(
    c,
    {
      className: `flex justify-center ${s}`,
      ...u,
      children: /* @__PURE__ */ b(
        "div",
        {
          className: `
          inline-flex items-center gap-2
          px-4 py-2 rounded-full
          text-sm font-medium
          border
          ${o.bg} ${o.border} ${o.text}
        `,
          children: [
            n && /* @__PURE__ */ l("span", { className: o.icon, children: qd[t] }),
            /* @__PURE__ */ l("span", { children: e }),
            a && /* @__PURE__ */ l(
              "button",
              {
                onClick: r,
                className: `
              ml-1 p-0.5 rounded-full
              hover:bg-black/5 transition-colors
              ${o.icon}
            `,
                "aria-label": "Dismiss",
                children: /* @__PURE__ */ l("svg", { className: "w-3 h-3", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
                  "path",
                  {
                    fillRule: "evenodd",
                    d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                    clipRule: "evenodd"
                  }
                ) })
              }
            )
          ]
        }
      )
    }
  );
}, oi = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-3"
}, Yu = ({
  children: e,
  sender: t,
  className: n = "",
  animate: s = !0,
  gap: i = "sm"
}) => {
  const a = t === "user" ? "items-end" : "items-start";
  return s ? /* @__PURE__ */ l(
    M.div,
    {
      className: `flex flex-col ${a} ${oi[i]} ${n}`,
      variants: Ee,
      initial: "hidden",
      animate: "visible",
      children: gt.Children.map(e, (r, o) => /* @__PURE__ */ l(M.div, { variants: Je, className: "w-full", children: r }, o))
    }
  ) : /* @__PURE__ */ l("div", { className: `flex flex-col ${a} ${oi[i]} ${n}`, children: e });
}, Xu = ({
  value: e,
  onChange: t,
  onSubmit: n,
  placeholder: s = "Type a message...",
  disabled: i = !1,
  maxRows: a = 6,
  minRows: r = 1,
  className: o = "",
  autoFocus: c = !1,
  showCharCount: u = !1,
  maxLength: d,
  onFocus: h,
  onBlur: f
}) => {
  const m = B(null), p = D(() => {
    const w = m.current;
    if (!w) return;
    w.style.height = "auto";
    const k = getComputedStyle(w), S = parseInt(k.lineHeight) || 24, v = parseInt(k.paddingTop) || 0, x = parseInt(k.paddingBottom) || 0, T = S * r + v + x, N = S * a + v + x, C = Math.min(Math.max(w.scrollHeight, T), N);
    w.style.height = `${C}px`;
  }, [r, a]);
  H(() => {
    p();
  }, [e, p]), H(() => {
    c && m.current && m.current.focus();
  }, [c]);
  const g = (w) => {
    w.key === "Enter" && !w.shiftKey && (w.preventDefault(), e.trim() && !i && n());
  }, y = (w) => {
    const k = w.target.value;
    d && k.length > d || t(k);
  };
  return /* @__PURE__ */ b("div", { className: `relative ${o}`, children: [
    /* @__PURE__ */ l(
      "textarea",
      {
        ref: m,
        value: e,
        onChange: y,
        onKeyDown: g,
        onFocus: h,
        onBlur: f,
        placeholder: s,
        disabled: i,
        rows: r,
        className: `
          w-full resize-none
          px-4 py-3
          text-[15px] leading-6
          text-slate-900 placeholder-slate-400
          bg-white
          border border-slate-200 rounded-xl
          focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
          transition-colors duration-200
          blade-ai-scrollbar
        `,
        style: {
          minHeight: `${24 * r + 24}px`
        }
      }
    ),
    u && d && /* @__PURE__ */ b(
      "div",
      {
        className: `
            absolute bottom-2 right-3
            text-xs
            ${e.length >= d ? "text-red-500" : "text-slate-400"}
          `,
        children: [
          e.length,
          "/",
          d
        ]
      }
    )
  ] });
}, Zd = {
  sm: { button: "w-8 h-8", icon: "w-4 h-4" },
  md: { button: "w-10 h-10", icon: "w-5 h-5" },
  lg: { button: "w-12 h-12", icon: "w-6 h-6" }
}, qu = ({
  onClick: e,
  variant: t = "send",
  isLoading: n = !1,
  disabled: s = !1,
  size: i = "md",
  className: a = ""
}) => {
  const { button: r, icon: o } = Zd[i], c = s || n, u = t === "send";
  return /* @__PURE__ */ l(
    M.button,
    {
      onClick: e,
      disabled: c,
      whileHover: c ? void 0 : { scale: 1.05 },
      whileTap: c ? void 0 : { scale: 0.95 },
      className: `
        ${r}
        rounded-full
        flex items-center justify-center
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${u ? c ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700" : "bg-red-500 text-white hover:bg-red-600"}
        ${a}
      `,
      "aria-label": n ? "Loading" : u ? "Send message" : "Stop generation",
      children: n ? /* @__PURE__ */ l(
        M.div,
        {
          className: `${o} border-2 border-current border-t-transparent rounded-full`,
          animate: { rotate: 360 },
          transition: { duration: 1, repeat: 1 / 0, ease: "linear" }
        }
      ) : u ? /* @__PURE__ */ l("svg", { className: o, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2,
          d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        }
      ) }) : /* @__PURE__ */ l("svg", { className: o, fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l("rect", { x: "6", y: "6", width: "12", height: "12", rx: "2" }) })
    }
  );
}, Zu = ({
  accept: e,
  maxSize: t,
  maxFiles: n = 10,
  onUpload: s,
  onError: i,
  variant: a = "dropzone",
  multiple: r = !0,
  disabled: o = !1,
  className: c = "",
  buttonLabel: u = "Upload File",
  dropzoneLabel: d = "Drop files here or click to browse"
}) => {
  const h = B(null), [f, m] = $(!1), p = D(
    (N) => {
      const C = Array.from(N), P = [], L = [];
      for (const E of C) {
        if (P.length >= n) {
          L.push(`Maximum ${n} files allowed`);
          break;
        }
        if (t && E.size > t) {
          L.push(`${E.name} exceeds maximum size of ${x(t)}`);
          continue;
        }
        if (e && !e.split(",").map((_) => _.trim()).some((_) => _.startsWith(".") ? E.name.toLowerCase().endsWith(_.toLowerCase()) : _.endsWith("/*") ? E.type.startsWith(_.replace("/*", "/")) : E.type === _)) {
          L.push(`${E.name} is not an accepted file type`);
          continue;
        }
        P.push(E);
      }
      return L.length > 0 && i && i(L[0]), P;
    },
    [e, t, n, i]
  ), g = D(
    (N) => {
      const C = p(N);
      C.length > 0 && s(C);
    },
    [p, s]
  ), y = D(
    (N) => {
      if (N.preventDefault(), m(!1), o) return;
      const C = N.dataTransfer.files;
      g(C);
    },
    [o, g]
  ), w = D(
    (N) => {
      N.preventDefault(), o || m(!0);
    },
    [o]
  ), k = D((N) => {
    N.preventDefault(), m(!1);
  }, []), S = () => {
    !o && h.current && h.current.click();
  }, v = (N) => {
    N.target.files && (g(N.target.files), N.target.value = "");
  }, x = (N) => {
    if (N === 0) return "0 Bytes";
    const C = 1024, P = ["Bytes", "KB", "MB", "GB"], L = Math.floor(Math.log(N) / Math.log(C));
    return parseFloat((N / Math.pow(C, L)).toFixed(2)) + " " + P[L];
  }, T = /* @__PURE__ */ l(
    "input",
    {
      ref: h,
      type: "file",
      accept: e,
      multiple: r,
      onChange: v,
      disabled: o,
      className: "hidden"
    }
  );
  return a === "button" ? /* @__PURE__ */ b("div", { className: c, children: [
    T,
    /* @__PURE__ */ b(
      "button",
      {
        type: "button",
        onClick: S,
        disabled: o,
        className: `
            inline-flex items-center gap-2
            px-4 py-2 rounded-lg
            text-sm font-medium
            border border-slate-200
            bg-white text-slate-700
            hover:bg-slate-50 hover:border-slate-300
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          `,
        children: [
          /* @__PURE__ */ l("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            }
          ) }),
          u
        ]
      }
    )
  ] }) : /* @__PURE__ */ b("div", { className: c, children: [
    T,
    /* @__PURE__ */ b(
      M.div,
      {
        onClick: S,
        onDrop: y,
        onDragOver: w,
        onDragLeave: k,
        animate: {
          borderColor: f ? "#3b82f6" : "#e2e8f0",
          backgroundColor: f ? "#eff6ff" : "#fafafa"
        },
        className: `
          relative
          flex flex-col items-center justify-center
          min-h-[120px] p-6
          border-2 border-dashed rounded-xl
          cursor-pointer
          transition-colors
          ${o ? "opacity-50 cursor-not-allowed" : "hover:border-slate-300 hover:bg-slate-50"}
        `,
        children: [
          /* @__PURE__ */ l(J, { children: f && /* @__PURE__ */ l(
            M.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "absolute inset-0 flex items-center justify-center bg-blue-50/80 rounded-xl",
              children: /* @__PURE__ */ l("span", { className: "text-blue-600 font-medium", children: "Drop files here" })
            }
          ) }),
          /* @__PURE__ */ l(
            "svg",
            {
              className: "w-8 h-8 text-slate-400 mb-3",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              children: /* @__PURE__ */ l(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 1.5,
                  d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                }
              )
            }
          ),
          /* @__PURE__ */ l("p", { className: "text-sm text-slate-600 text-center", children: d }),
          (e || t) && /* @__PURE__ */ b("p", { className: "text-xs text-slate-400 mt-1", children: [
            e && `Accepted: ${e}`,
            e && t && " • ",
            t && `Max size: ${x(t)}`
          ] })
        ]
      }
    )
  ] });
}, Jd = {
  image: /* @__PURE__ */ l("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
    "path",
    {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    }
  ) }),
  file: /* @__PURE__ */ l("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
    "path",
    {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    }
  ) }),
  document: /* @__PURE__ */ l("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
    "path",
    {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    }
  ) }),
  video: /* @__PURE__ */ l("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
    "path",
    {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    }
  ) }),
  audio: /* @__PURE__ */ l("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
    "path",
    {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
    }
  ) })
}, Ju = ({
  filename: e,
  type: t = "file",
  preview: n,
  size: s,
  progress: i,
  onRemove: a,
  onClick: r,
  className: o = "",
  error: c = !1,
  errorMessage: u
}) => {
  const d = (m) => {
    if (m === 0) return "0 B";
    const p = 1024, g = ["B", "KB", "MB", "GB"], y = Math.floor(Math.log(m) / Math.log(p));
    return parseFloat((m / Math.pow(p, y)).toFixed(1)) + " " + g[y];
  }, h = i !== void 0 && i < 100, f = e.length > 20 ? e.slice(0, 8) + "..." + e.slice(-8) : e;
  return /* @__PURE__ */ b(
    M.div,
    {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
      className: `
        inline-flex items-center gap-2
        px-3 py-2 rounded-lg
        text-sm
        ${c ? "bg-red-50 border border-red-200" : "bg-slate-100 border border-slate-200"}
        ${r ? "cursor-pointer hover:bg-slate-200" : ""}
        ${o}
      `,
      onClick: r,
      children: [
        t === "image" && n ? /* @__PURE__ */ l(
          "img",
          {
            src: n,
            alt: e,
            className: "w-8 h-8 rounded object-cover"
          }
        ) : /* @__PURE__ */ l("span", { className: c ? "text-red-500" : "text-slate-500", children: Jd[t] }),
        /* @__PURE__ */ b("div", { className: "flex flex-col min-w-0", children: [
          /* @__PURE__ */ l(
            "span",
            {
              className: `truncate font-medium ${c ? "text-red-700" : "text-slate-700"}`,
              title: e,
              children: f
            }
          ),
          (s || u) && /* @__PURE__ */ l("span", { className: `text-xs ${c ? "text-red-500" : "text-slate-400"}`, children: c && u ? u : s ? d(s) : "" })
        ] }),
        h && /* @__PURE__ */ l("div", { className: "w-12 h-1 bg-slate-200 rounded-full overflow-hidden", children: /* @__PURE__ */ l(
          M.div,
          {
            className: "h-full bg-blue-500",
            initial: { width: 0 },
            animate: { width: `${i}%` },
            transition: { duration: 0.2 }
          }
        ) }),
        a && !h && /* @__PURE__ */ l(
          "button",
          {
            onClick: (m) => {
              m.stopPropagation(), a();
            },
            className: `
            p-1 rounded-full
            hover:bg-slate-300
            transition-colors
            ${c ? "text-red-500 hover:bg-red-100" : "text-slate-400"}
          `,
            "aria-label": "Remove attachment",
            children: /* @__PURE__ */ l("svg", { className: "w-3 h-3", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
              "path",
              {
                fillRule: "evenodd",
                d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                clipRule: "evenodd"
              }
            ) })
          }
        )
      ]
    }
  );
}, Qd = {
  sm: { button: "w-8 h-8", icon: "w-4 h-4" },
  md: { button: "w-10 h-10", icon: "w-5 h-5" },
  lg: { button: "w-12 h-12", icon: "w-6 h-6" }
}, Qu = ({
  onRecording: e,
  onTranscript: t,
  onError: n,
  isRecording: s,
  disabled: i = !1,
  size: a = "md",
  className: r = ""
}) => {
  const [o, c] = $(!1), u = s ?? o, { button: d, icon: h } = Qd[a], f = D(() => {
    if (i) return;
    const m = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!m) {
      n == null || n("Speech recognition is not supported in this browser");
      return;
    }
    if (u)
      c(!1), e == null || e(!1);
    else {
      const p = new m();
      p.continuous = !1, p.interimResults = !1, p.lang = "en-US", p.onstart = () => {
        c(!0), e == null || e(!0);
      }, p.onresult = (g) => {
        const y = g.results[0][0].transcript;
        t == null || t(y);
      }, p.onerror = (g) => {
        c(!1), e == null || e(!1), n == null || n(g.error || "Speech recognition error");
      }, p.onend = () => {
        c(!1), e == null || e(!1);
      };
      try {
        p.start();
      } catch {
        n == null || n("Failed to start speech recognition");
      }
    }
  }, [i, u, e, t, n]);
  return /* @__PURE__ */ b(
    M.button,
    {
      onClick: f,
      disabled: i,
      whileHover: i ? void 0 : { scale: 1.05 },
      whileTap: i ? void 0 : { scale: 0.95 },
      className: `
        ${d}
        rounded-full
        flex items-center justify-center
        relative
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${u ? "bg-red-500 text-white" : i ? "bg-slate-100 text-slate-300 cursor-not-allowed" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}
        ${r}
      `,
      "aria-label": u ? "Stop recording" : "Start voice input",
      children: [
        /* @__PURE__ */ l(J, { children: u && /* @__PURE__ */ l(
          M.div,
          {
            initial: { scale: 1, opacity: 0.5 },
            animate: {
              scale: [1, 1.4, 1],
              opacity: [0.5, 0, 0.5]
            },
            exit: { scale: 1, opacity: 0 },
            transition: {
              duration: 1.5,
              repeat: 1 / 0,
              ease: "easeInOut"
            },
            className: "absolute inset-0 rounded-full bg-red-500"
          }
        ) }),
        /* @__PURE__ */ l(
          "svg",
          {
            className: `${h} relative z-10`,
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /* @__PURE__ */ l(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              }
            )
          }
        )
      ]
    }
  );
}, eh = ({
  steps: e = [],
  currentStep: t = 0,
  variant: n = "logo",
  label: s,
  className: i = "",
  isPaused: a = !1
}) => {
  var o;
  const r = ((o = e[t]) == null ? void 0 : o.label) || s || "Thinking...";
  return /* @__PURE__ */ b(
    M.div,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      className: `flex items-center gap-3 ${i}`,
      children: [
        n === "logo" && /* @__PURE__ */ l(Nt, { size: "md", animate: a ? "none" : "rotate", isPaused: a }),
        n === "spinner" && /* @__PURE__ */ l(
          M.div,
          {
            className: "w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full",
            animate: a ? {} : { rotate: 360 },
            transition: { duration: 1, repeat: 1 / 0, ease: "linear" }
          }
        ),
        n === "dots" && /* @__PURE__ */ l("div", { className: "flex gap-1", children: [0, 1, 2].map((c) => /* @__PURE__ */ l(
          M.div,
          {
            className: "w-2 h-2 bg-slate-400 rounded-full",
            animate: a ? {} : {
              y: [0, -6, 0],
              opacity: [0.5, 1, 0.5]
            },
            transition: {
              duration: 0.8,
              repeat: 1 / 0,
              delay: c * 0.15,
              ease: "easeInOut"
            }
          },
          c
        )) }),
        /* @__PURE__ */ l("div", { className: "relative overflow-hidden", children: /* @__PURE__ */ l(
          M.span,
          {
            initial: { y: 10, opacity: 0, filter: "blur(4px)" },
            animate: { y: 0, opacity: 1, filter: "blur(0px)" },
            exit: { y: -10, opacity: 0, filter: "blur(4px)" },
            transition: { duration: 0.3 },
            className: `
            text-[15px] leading-6
            bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600
            bg-[length:200%_100%] bg-clip-text text-transparent
          `,
            style: a ? {} : {
              animation: "blade-ai-shimmer 2s linear infinite"
            },
            children: r
          },
          r
        ) })
      ]
    }
  );
}, th = ({
  steps: e,
  collapsible: t = !1,
  defaultCollapsed: n = !1,
  onStepChange: s,
  autoCycle: i = !1,
  cycleInterval: a = 1200,
  className: r = "",
  mode: o = "thinking"
}) => {
  const [c, u] = $(n), [d, h] = $(0), f = o === "thinking";
  H(() => {
    if (!i || !f || e.length === 0) return;
    const g = setInterval(() => {
      h((y) => {
        const w = (y + 1) % e.length;
        return s == null || s(w), w;
      });
    }, a);
    return () => clearInterval(g);
  }, [i, f, e.length, a, s]);
  const m = e[d], p = (g) => {
    switch (g) {
      case "complete":
        return /* @__PURE__ */ l("svg", { className: "w-4 h-4 text-emerald-500", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
          "path",
          {
            fillRule: "evenodd",
            d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
            clipRule: "evenodd"
          }
        ) });
      case "error":
        return /* @__PURE__ */ l("svg", { className: "w-4 h-4 text-red-500", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
          "path",
          {
            fillRule: "evenodd",
            d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
            clipRule: "evenodd"
          }
        ) });
      case "active":
        return /* @__PURE__ */ l(
          M.div,
          {
            className: "w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full",
            animate: { rotate: 360 },
            transition: { duration: 1, repeat: 1 / 0, ease: "linear" }
          }
        );
      default:
        return /* @__PURE__ */ l("div", { className: "w-4 h-4 rounded-full bg-slate-200" });
    }
  };
  return i && f ? /* @__PURE__ */ b(
    M.div,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      className: `flex items-center gap-3 ${r}`,
      children: [
        /* @__PURE__ */ l(Nt, { size: "md", animate: "rotate" }),
        /* @__PURE__ */ l("div", { className: "h-[26px] relative min-w-[200px] overflow-hidden", children: /* @__PURE__ */ l(J, { mode: "wait", children: /* @__PURE__ */ l(
          M.span,
          {
            initial: { y: 12, opacity: 0, filter: "blur(6px)" },
            animate: { y: 0, opacity: 1, filter: "blur(0px)" },
            exit: { y: -12, opacity: 0, filter: "blur(6px)" },
            transition: { duration: 0.3 },
            className: `
                absolute left-0 top-0 whitespace-nowrap
                text-[15px] leading-[26px]
                bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600
                bg-[length:200%_100%] bg-clip-text text-transparent
              `,
            style: {
              animation: "blade-ai-shimmer 2s linear infinite"
            },
            children: m == null ? void 0 : m.label
          },
          d
        ) }) })
      ]
    }
  ) : /* @__PURE__ */ b("div", { className: r, children: [
    t && /* @__PURE__ */ b(
      "button",
      {
        onClick: () => u(!c),
        className: `
            flex items-center gap-2 w-full
            px-3 py-2 rounded-lg
            text-sm font-medium text-slate-600
            hover:bg-slate-50 transition-colors
          `,
        children: [
          /* @__PURE__ */ l(
            M.svg,
            {
              className: "w-4 h-4",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              animate: { rotate: c ? 0 : 90 },
              transition: { duration: 0.2 },
              children: /* @__PURE__ */ l(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M9 5l7 7-7 7"
                }
              )
            }
          ),
          /* @__PURE__ */ b("span", { children: [
            "Reasoning steps (",
            e.length,
            ")"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ l(J, { children: (!t || !c) && /* @__PURE__ */ l(
      M.div,
      {
        initial: t ? { height: 0, opacity: 0 } : !1,
        animate: { height: "auto", opacity: 1 },
        exit: { height: 0, opacity: 0 },
        transition: { duration: 0.2 },
        className: "overflow-hidden",
        children: /* @__PURE__ */ l("div", { className: "flex flex-col gap-2 pt-2", children: e.map((g, y) => /* @__PURE__ */ b(
          M.div,
          {
            initial: { opacity: 0, x: -10 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: y * 0.05 },
            className: "flex items-start gap-3 px-3",
            children: [
              /* @__PURE__ */ l("div", { className: "shrink-0 mt-0.5", children: p(g.status) }),
              /* @__PURE__ */ b("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ l(
                  "p",
                  {
                    className: `text-sm ${g.status === "complete" ? "text-slate-600" : g.status === "error" ? "text-red-600" : g.status === "active" ? "text-slate-900 font-medium" : "text-slate-400"}`,
                    children: g.label
                  }
                ),
                g.detail && /* @__PURE__ */ l("p", { className: "text-xs text-slate-400 mt-0.5", children: g.detail })
              ] })
            ]
          },
          y
        )) })
      }
    ) })
  ] });
}, eu = {
  pending: {
    icon: /* @__PURE__ */ l("div", { className: "w-4 h-4 rounded-full border-2 border-slate-300 border-dashed" }),
    label: "Pending",
    color: "text-slate-400"
  },
  running: {
    icon: /* @__PURE__ */ l(
      M.div,
      {
        className: "w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full",
        animate: { rotate: 360 },
        transition: { duration: 1, repeat: 1 / 0, ease: "linear" }
      }
    ),
    label: "Running",
    color: "text-blue-600"
  },
  success: {
    icon: /* @__PURE__ */ l("svg", { className: "w-4 h-4 text-emerald-500", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
      "path",
      {
        fillRule: "evenodd",
        d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
        clipRule: "evenodd"
      }
    ) }),
    label: "Success",
    color: "text-emerald-600"
  },
  error: {
    icon: /* @__PURE__ */ l("svg", { className: "w-4 h-4 text-red-500", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
      "path",
      {
        fillRule: "evenodd",
        d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
        clipRule: "evenodd"
      }
    ) }),
    label: "Error",
    color: "text-red-600"
  }
}, nh = ({
  tool: e,
  input: t,
  output: n,
  status: s = "pending",
  duration: i,
  error: a,
  collapsible: r = !1,
  defaultCollapsed: o = !0,
  className: c = ""
}) => {
  const [u, d] = $(!o), h = eu[s], f = (g) => g === void 0 ? "" : typeof g == "string" ? g : JSON.stringify(g, null, 2), m = f(t), p = f(n);
  return /* @__PURE__ */ b(
    M.div,
    {
      initial: { opacity: 0, y: 5 },
      animate: { opacity: 1, y: 0 },
      className: `
        border border-slate-200 rounded-lg overflow-hidden
        ${c}
      `,
      children: [
        /* @__PURE__ */ b(
          "div",
          {
            className: `
          flex items-center gap-3 px-4 py-3
          bg-slate-50
          ${r ? "cursor-pointer hover:bg-slate-100" : ""}
        `,
            onClick: r ? () => d(!u) : void 0,
            children: [
              /* @__PURE__ */ l("div", { className: "shrink-0", children: h.icon }),
              /* @__PURE__ */ b("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ l("span", { className: "font-mono text-sm font-medium text-slate-700", children: e }),
                i && s === "success" && /* @__PURE__ */ b("span", { className: "text-xs text-slate-400 ml-2", children: [
                  "(",
                  i,
                  "ms)"
                ] })
              ] }),
              /* @__PURE__ */ l("span", { className: `text-xs font-medium ${h.color}`, children: h.label }),
              r && (t || n) && /* @__PURE__ */ l(
                M.svg,
                {
                  className: "w-4 h-4 text-slate-400",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  animate: { rotate: u ? 180 : 0 },
                  transition: { duration: 0.2 },
                  children: /* @__PURE__ */ l(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M19 9l-7 7-7-7"
                    }
                  )
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ l(J, { children: (!r || u) && (t || n || a) && /* @__PURE__ */ l(
          M.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            transition: { duration: 0.2 },
            className: "border-t border-slate-200",
            children: /* @__PURE__ */ b("div", { className: "p-4 space-y-3", children: [
              m && /* @__PURE__ */ b("div", { children: [
                /* @__PURE__ */ l("span", { className: "text-xs font-medium text-slate-500 uppercase tracking-wide", children: "Input" }),
                /* @__PURE__ */ l("pre", { className: "mt-1 p-3 bg-slate-800 text-slate-200 rounded-md text-xs font-mono overflow-x-auto", children: m })
              ] }),
              p && s === "success" && /* @__PURE__ */ b("div", { children: [
                /* @__PURE__ */ l("span", { className: "text-xs font-medium text-slate-500 uppercase tracking-wide", children: "Output" }),
                /* @__PURE__ */ l("pre", { className: "mt-1 p-3 bg-slate-800 text-emerald-300 rounded-md text-xs font-mono overflow-x-auto", children: p })
              ] }),
              a && s === "error" && /* @__PURE__ */ b("div", { children: [
                /* @__PURE__ */ l("span", { className: "text-xs font-medium text-red-500 uppercase tracking-wide", children: "Error" }),
                /* @__PURE__ */ l("pre", { className: "mt-1 p-3 bg-red-50 text-red-700 rounded-md text-xs font-mono", children: a })
              ] })
            ] })
          }
        ) })
      ]
    }
  );
}, tu = {
  pending: {
    icon: /* @__PURE__ */ l("div", { className: "w-3 h-3 rounded-full bg-slate-200" }),
    textClass: "text-slate-400"
  },
  extracting: {
    icon: /* @__PURE__ */ l(
      M.div,
      {
        className: "w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full",
        animate: { rotate: 360 },
        transition: { duration: 0.8, repeat: 1 / 0, ease: "linear" }
      }
    ),
    textClass: "text-blue-600"
  },
  complete: {
    icon: /* @__PURE__ */ l("svg", { className: "w-3 h-3 text-emerald-500", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
      "path",
      {
        fillRule: "evenodd",
        d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
        clipRule: "evenodd"
      }
    ) }),
    textClass: "text-slate-700"
  },
  error: {
    icon: /* @__PURE__ */ l("svg", { className: "w-3 h-3 text-red-500", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
      "path",
      {
        fillRule: "evenodd",
        d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
        clipRule: "evenodd"
      }
    ) }),
    textClass: "text-red-600"
  }
}, sh = ({
  fields: e,
  progress: t = 0,
  showProgress: n = !0,
  title: s = "Processing...",
  className: i = ""
}) => {
  const a = e.filter((o) => o.status === "complete").length, r = t > 0 ? t : Math.round(a / e.length * 100);
  return /* @__PURE__ */ b(
    M.div,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      className: `
        border border-slate-200 rounded-lg p-4
        bg-white
        ${i}
      `,
      children: [
        /* @__PURE__ */ b("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ l("span", { className: "text-sm font-medium text-slate-700", children: s }),
          n && /* @__PURE__ */ b("span", { className: "text-xs text-slate-500", children: [
            a,
            "/",
            e.length
          ] })
        ] }),
        n && /* @__PURE__ */ l("div", { className: "h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4", children: /* @__PURE__ */ l(
          M.div,
          {
            className: "h-full bg-blue-500 rounded-full",
            initial: { width: 0 },
            animate: { width: `${r}%` },
            transition: { duration: 0.3, ease: "easeOut" }
          }
        ) }),
        /* @__PURE__ */ l("div", { className: "space-y-2", children: e.map((o, c) => {
          const u = tu[o.status];
          return /* @__PURE__ */ b(
            M.div,
            {
              initial: { opacity: 0, x: -5 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: c * 0.05 },
              className: "flex items-center gap-3",
              children: [
                /* @__PURE__ */ l("div", { className: "shrink-0 w-3 h-3", children: u.icon }),
                /* @__PURE__ */ l("span", { className: `text-sm ${u.textClass} flex-1`, children: o.name }),
                o.status === "complete" && o.value && /* @__PURE__ */ l(
                  M.span,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    className: "text-sm font-medium text-slate-900 truncate max-w-[150px]",
                    title: o.value,
                    children: o.value
                  }
                ),
                o.status === "extracting" && /* @__PURE__ */ l("span", { className: "text-xs text-blue-500", children: "extracting..." })
              ]
            },
            o.name
          );
        }) })
      ]
    }
  );
}, nu = {
  code: /* @__PURE__ */ l("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
    "path",
    {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
    }
  ) }),
  table: /* @__PURE__ */ l("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
    "path",
    {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    }
  ) }),
  chart: /* @__PURE__ */ l("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
    "path",
    {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    }
  ) }),
  image: /* @__PURE__ */ l("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
    "path",
    {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    }
  ) }),
  document: /* @__PURE__ */ l("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
    "path",
    {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    }
  ) }),
  card: /* @__PURE__ */ l("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
    "path",
    {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    }
  ) }),
  form: /* @__PURE__ */ l("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
    "path",
    {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 2,
      d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    }
  ) }),
  custom: null
}, su = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6"
}, ih = ({
  title: e,
  type: t = "custom",
  actions: n = [],
  children: s,
  className: i = "",
  animate: a = !0,
  bordered: r = !0,
  padding: o = "md"
}) => {
  const c = a ? M.div : "div", u = a ? { variants: wt, initial: "hidden", animate: "visible" } : {}, d = nu[t];
  return /* @__PURE__ */ b(
    c,
    {
      className: `
        rounded-xl overflow-hidden bg-white
        ${r ? "border border-slate-200" : ""}
        ${i}
      `,
      ...u,
      children: [
        (e || n.length > 0) && /* @__PURE__ */ b("div", { className: "flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50", children: [
          /* @__PURE__ */ b("div", { className: "flex items-center gap-2", children: [
            d && /* @__PURE__ */ l("span", { className: "text-slate-400", children: d }),
            e && /* @__PURE__ */ l("span", { className: "text-sm font-medium text-slate-700", children: e })
          ] }),
          n.length > 0 && /* @__PURE__ */ l("div", { className: "flex items-center gap-1", children: n.map((h) => /* @__PURE__ */ b(
            "button",
            {
              onClick: h.onClick,
              className: `
                    flex items-center gap-1.5
                    px-2.5 py-1.5 rounded-md
                    text-xs font-medium text-slate-600
                    hover:bg-slate-200 transition-colors
                  `,
              title: h.label,
              children: [
                h.icon,
                /* @__PURE__ */ l("span", { className: "hidden sm:inline", children: h.label })
              ]
            },
            h.id
          )) })
        ] }),
        /* @__PURE__ */ l("div", { className: su[o], children: s })
      ]
    }
  );
}, rh = ({
  code: e,
  language: t = "text",
  showLineNumbers: n = !0,
  onCopy: s,
  title: i,
  maxHeight: a = 400,
  className: r = "",
  highlightLines: o = []
}) => {
  const [c, u] = $(!1), d = e.split(`
`), h = async () => {
    try {
      await navigator.clipboard.writeText(e), u(!0), s == null || s(), setTimeout(() => u(!1), 2e3);
    } catch (f) {
      console.error("Failed to copy:", f);
    }
  };
  return /* @__PURE__ */ b(
    "div",
    {
      className: `
        rounded-lg overflow-hidden
        bg-[#1e293b] text-slate-200
        ${r}
      `,
      children: [
        /* @__PURE__ */ b("div", { className: "flex items-center justify-between px-4 py-2 bg-[#0f172a] border-b border-slate-700", children: [
          /* @__PURE__ */ b("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ l("span", { className: "text-xs font-medium text-slate-400 uppercase tracking-wide", children: t }),
            i && /* @__PURE__ */ b(be, { children: [
              /* @__PURE__ */ l("span", { className: "text-slate-600", children: "•" }),
              /* @__PURE__ */ l("span", { className: "text-xs text-slate-400", children: i })
            ] })
          ] }),
          /* @__PURE__ */ l(
            M.button,
            {
              onClick: h,
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              className: `
            flex items-center gap-1.5
            px-2 py-1 rounded
            text-xs text-slate-400
            hover:text-slate-200 hover:bg-slate-700
            transition-colors
          `,
              children: c ? /* @__PURE__ */ b(be, { children: [
                /* @__PURE__ */ l("svg", { className: "w-3.5 h-3.5 text-emerald-400", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
                  "path",
                  {
                    fillRule: "evenodd",
                    d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                    clipRule: "evenodd"
                  }
                ) }),
                /* @__PURE__ */ l("span", { className: "text-emerald-400", children: "Copied" })
              ] }) : /* @__PURE__ */ b(be, { children: [
                /* @__PURE__ */ l("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  }
                ) }),
                /* @__PURE__ */ l("span", { children: "Copy" })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ l(
          "div",
          {
            className: "overflow-auto blade-ai-scrollbar",
            style: { maxHeight: typeof a == "number" ? `${a}px` : a },
            children: /* @__PURE__ */ l("pre", { className: "p-4 text-[13px] leading-6 font-mono", children: /* @__PURE__ */ l("code", { className: "blade-ai-code", children: d.map((f, m) => {
              const p = m + 1, g = o.includes(p);
              return /* @__PURE__ */ b(
                "div",
                {
                  className: `
                    flex
                    ${g ? "bg-blue-500/10 -mx-4 px-4" : ""}
                  `,
                  children: [
                    n && /* @__PURE__ */ l(
                      "span",
                      {
                        className: `
                        inline-block w-8 mr-4 text-right select-none shrink-0
                        ${g ? "text-blue-400" : "text-slate-600"}
                      `,
                        children: p
                      }
                    ),
                    /* @__PURE__ */ l("span", { className: "flex-1 whitespace-pre-wrap break-all", children: f || " " })
                  ]
                },
                m
              );
            }) }) })
          }
        )
      ]
    }
  );
};
function ah({
  columns: e,
  rows: t,
  onRowClick: n,
  animate: s = !0,
  showHeader: i = !0,
  striped: a = !1,
  hoverable: r = !0,
  compact: o = !1,
  className: c = "",
  emptyMessage: u = "No data available",
  getRowKey: d
}) {
  const h = o ? "px-3 py-2" : "px-4 py-3", f = (g, y) => d ? d(g, y) : "id" in g ? g.id : y, m = s ? M.tbody : "tbody", p = s ? M.tr : "tr";
  return /* @__PURE__ */ l("div", { className: `overflow-x-auto blade-ai-scrollbar ${c}`, children: /* @__PURE__ */ b("table", { className: "w-full text-sm", children: [
    i && /* @__PURE__ */ l("thead", { children: /* @__PURE__ */ l("tr", { className: "border-b border-slate-200", children: e.map((g) => /* @__PURE__ */ l(
      "th",
      {
        className: `
                    ${h}
                    text-left font-semibold text-slate-600
                    bg-slate-50
                    ${g.align === "center" ? "text-center" : ""}
                    ${g.align === "right" ? "text-right" : ""}
                  `,
        style: { width: g.width },
        children: g.label
      },
      g.key
    )) }) }),
    /* @__PURE__ */ l(
      m,
      {
        ...s ? {
          variants: Ee,
          initial: "hidden",
          animate: "visible"
        } : {},
        children: t.length === 0 ? /* @__PURE__ */ l("tr", { children: /* @__PURE__ */ l(
          "td",
          {
            colSpan: e.length,
            className: "px-4 py-8 text-center text-slate-400",
            children: u
          }
        ) }) : t.map((g, y) => /* @__PURE__ */ l(
          p,
          {
            ...s ? { variants: Od } : {},
            onClick: n ? () => n(g, y) : void 0,
            className: `
                  border-b border-slate-100 last:border-b-0
                  ${a && y % 2 === 1 ? "bg-slate-50/50" : ""}
                  ${r ? "hover:bg-slate-50 transition-colors" : ""}
                  ${n ? "cursor-pointer" : ""}
                `,
            children: e.map((w) => {
              const k = g[w.key], S = w.render ? w.render(k, g, y) : String(k ?? "");
              return /* @__PURE__ */ l(
                "td",
                {
                  className: `
                        ${h}
                        text-slate-700
                        ${w.align === "center" ? "text-center" : ""}
                        ${w.align === "right" ? "text-right" : ""}
                      `,
                  children: S
                },
                w.key
              );
            })
          },
          f(g, y)
        ))
      }
    )
  ] }) });
}
const iu = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200",
  ghost: "text-slate-600 hover:bg-slate-100"
}, oh = ({
  title: e,
  subtitle: t,
  fields: n,
  actions: s = [],
  className: i = "",
  animate: a = !0,
  layout: r = "grid",
  dividers: o = !1
}) => {
  const c = a ? M.div : "div", u = a ? { variants: wt, initial: "hidden", animate: "visible" } : {}, d = a ? M.div : "div", h = a ? { variants: Ee, initial: "hidden", animate: "visible" } : {}, f = a ? M.div : "div", m = a ? { variants: Je } : {};
  return /* @__PURE__ */ b(
    c,
    {
      className: `
        bg-white rounded-xl border border-slate-200 overflow-hidden
        ${i}
      `,
      ...u,
      children: [
        (e || t) && /* @__PURE__ */ b("div", { className: "px-5 py-4 border-b border-slate-100", children: [
          e && /* @__PURE__ */ l("h3", { className: "text-base font-semibold text-slate-900", children: e }),
          t && /* @__PURE__ */ l("p", { className: "text-sm text-slate-500 mt-0.5", children: t })
        ] }),
        /* @__PURE__ */ l(
          d,
          {
            className: `
          px-5 py-4
          ${r === "grid" ? "grid grid-cols-2 gap-4" : "flex flex-col gap-3"}
        `,
            ...h,
            children: n.map((p, g) => /* @__PURE__ */ l(
              f,
              {
                className: `
              ${p.fullWidth && r === "grid" ? "col-span-2" : ""}
              ${o && g > 0 && r === "stacked" ? "border-t border-slate-100 pt-3" : ""}
            `,
                ...m,
                children: /* @__PURE__ */ b("div", { className: "flex items-start gap-2", children: [
                  p.icon && /* @__PURE__ */ l("span", { className: "text-slate-400 mt-0.5 shrink-0", children: p.icon }),
                  /* @__PURE__ */ b("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ l("p", { className: "text-xs font-medium text-slate-500 uppercase tracking-wide mb-1", children: p.label }),
                    /* @__PURE__ */ l(
                      "p",
                      {
                        className: `
                    text-sm
                    ${p.highlight ? "font-semibold text-slate-900" : "text-slate-700"}
                  `,
                        children: p.value
                      }
                    )
                  ] })
                ] })
              },
              p.label
            ))
          }
        ),
        s.length > 0 && /* @__PURE__ */ l("div", { className: "px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2", children: s.map((p) => /* @__PURE__ */ b(
          "button",
          {
            onClick: p.onClick,
            className: `
                flex items-center gap-2
                px-4 py-2 rounded-lg
                text-sm font-medium
                transition-colors
                ${iu[p.variant || "secondary"]}
              `,
            children: [
              p.icon,
              p.label
            ]
          },
          p.id
        )) })
      ]
    }
  );
}, lh = ({
  src: e,
  alt: t = "",
  zoomable: n = !0,
  caption: s,
  aspectRatio: i,
  maxHeight: a = 400,
  fit: r = "contain",
  className: o = "",
  onError: c
}) => {
  const [u, d] = $(!1), [h, f] = $(!1), m = () => {
    f(!0), c == null || c();
  };
  return h ? /* @__PURE__ */ b(
    "div",
    {
      className: `
          flex flex-col items-center justify-center
          bg-slate-100 rounded-lg
          p-8 text-slate-400
          ${o}
        `,
      style: {
        aspectRatio: i,
        maxHeight: typeof a == "number" ? `${a}px` : a
      },
      children: [
        /* @__PURE__ */ l("svg", { className: "w-12 h-12 mb-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.5,
            d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          }
        ) }),
        /* @__PURE__ */ l("span", { className: "text-sm", children: "Failed to load image" })
      ]
    }
  ) : /* @__PURE__ */ b(be, { children: [
    /* @__PURE__ */ b("figure", { className: `relative ${o}`, children: [
      /* @__PURE__ */ b(
        "div",
        {
          className: `
            overflow-hidden rounded-lg bg-slate-100
            ${n ? "cursor-zoom-in" : ""}
          `,
          style: {
            aspectRatio: i,
            maxHeight: typeof a == "number" ? `${a}px` : a
          },
          onClick: n ? () => d(!0) : void 0,
          children: [
            /* @__PURE__ */ l(
              "img",
              {
                src: e,
                alt: t,
                onError: m,
                className: `
              w-full h-full
              ${r === "cover" ? "object-cover" : ""}
              ${r === "contain" ? "object-contain" : ""}
              ${r === "fill" ? "object-fill" : ""}
            `
              }
            ),
            n && /* @__PURE__ */ l(
              "div",
              {
                className: `
                absolute inset-0
                flex items-center justify-center
                bg-black/0 hover:bg-black/10
                transition-colors
              `,
                children: /* @__PURE__ */ l(
                  M.div,
                  {
                    initial: { opacity: 0 },
                    whileHover: { opacity: 1 },
                    className: `
                  p-2 rounded-full bg-white/90 shadow-lg
                  opacity-0 group-hover:opacity-100
                `,
                    children: /* @__PURE__ */ l(
                      "svg",
                      {
                        className: "w-5 h-5 text-slate-600",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /* @__PURE__ */ l(
                          "path",
                          {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          }
                        )
                      }
                    )
                  }
                )
              }
            )
          ]
        }
      ),
      s && /* @__PURE__ */ l("figcaption", { className: "mt-2 text-sm text-slate-500 text-center", children: s })
    ] }),
    /* @__PURE__ */ l(J, { children: u && /* @__PURE__ */ b(
      M.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
        className: `
              fixed inset-0 z-50
              flex items-center justify-center
              bg-black/80 cursor-zoom-out
              p-4
            `,
        onClick: () => d(!1),
        children: [
          /* @__PURE__ */ l(
            "button",
            {
              onClick: () => d(!1),
              className: `
                absolute top-4 right-4
                p-2 rounded-full
                bg-white/10 text-white
                hover:bg-white/20
                transition-colors
              `,
              "aria-label": "Close",
              children: /* @__PURE__ */ l("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M6 18L18 6M6 6l12 12"
                }
              ) })
            }
          ),
          /* @__PURE__ */ l(
            M.img,
            {
              src: e,
              alt: t,
              initial: { scale: 0.9, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              exit: { scale: 0.9, opacity: 0 },
              transition: { type: "spring", stiffness: 300, damping: 30 },
              className: "max-w-full max-h-full object-contain rounded-lg",
              onClick: (p) => p.stopPropagation()
            }
          ),
          s && /* @__PURE__ */ l(
            M.p,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              className: `
                  absolute bottom-4 left-0 right-0
                  text-center text-white/80 text-sm
                `,
              children: s
            }
          )
        ]
      }
    ) })
  ] });
}, ch = ({
  src: e,
  type: t = "pdf",
  title: n,
  pages: s,
  currentPage: i = 1,
  height: a = 500,
  className: r = "",
  onPageChange: o,
  showDownload: c = !0,
  downloadUrl: u
}) => {
  const [d, h] = $(i), [f, m] = $(!0), p = (y) => {
    y >= 1 && (!s || y <= s) && (h(y), o == null || o(y));
  }, g = () => {
    const y = document.createElement("a");
    y.href = u || e, y.download = n || "document", document.body.appendChild(y), y.click(), document.body.removeChild(y);
  };
  return /* @__PURE__ */ b(
    "div",
    {
      className: `
        border border-slate-200 rounded-lg overflow-hidden bg-white
        ${r}
      `,
      children: [
        /* @__PURE__ */ b("div", { className: "flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50", children: [
          /* @__PURE__ */ b("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ l("div", { className: "w-8 h-8 rounded bg-red-100 flex items-center justify-center", children: t === "pdf" ? /* @__PURE__ */ l("span", { className: "text-xs font-bold text-red-600", children: "PDF" }) : /* @__PURE__ */ l(
              "svg",
              {
                className: "w-4 h-4 text-slate-600",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ l(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  }
                )
              }
            ) }),
            /* @__PURE__ */ b("div", { children: [
              n && /* @__PURE__ */ l("p", { className: "text-sm font-medium text-slate-700", children: n }),
              s && /* @__PURE__ */ b("p", { className: "text-xs text-slate-500", children: [
                s,
                " page",
                s !== 1 ? "s" : ""
              ] })
            ] })
          ] }),
          /* @__PURE__ */ b("div", { className: "flex items-center gap-2", children: [
            s && s > 1 && /* @__PURE__ */ b("div", { className: "flex items-center gap-1 mr-2", children: [
              /* @__PURE__ */ l(
                "button",
                {
                  onClick: () => p(d - 1),
                  disabled: d <= 1,
                  className: `
                  p-1.5 rounded hover:bg-slate-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors
                `,
                  "aria-label": "Previous page",
                  children: /* @__PURE__ */ l(
                    "svg",
                    {
                      className: "w-4 h-4 text-slate-600",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      children: /* @__PURE__ */ l(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: 2,
                          d: "M15 19l-7-7 7-7"
                        }
                      )
                    }
                  )
                }
              ),
              /* @__PURE__ */ b("span", { className: "text-xs text-slate-600 min-w-[60px] text-center", children: [
                d,
                " / ",
                s
              ] }),
              /* @__PURE__ */ l(
                "button",
                {
                  onClick: () => p(d + 1),
                  disabled: d >= s,
                  className: `
                  p-1.5 rounded hover:bg-slate-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors
                `,
                  "aria-label": "Next page",
                  children: /* @__PURE__ */ l(
                    "svg",
                    {
                      className: "w-4 h-4 text-slate-600",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      children: /* @__PURE__ */ l(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: 2,
                          d: "M9 5l7 7-7 7"
                        }
                      )
                    }
                  )
                }
              )
            ] }),
            c && /* @__PURE__ */ b(
              "button",
              {
                onClick: g,
                className: `
                flex items-center gap-1.5
                px-3 py-1.5 rounded-md
                text-xs font-medium text-slate-600
                hover:bg-slate-200 transition-colors
              `,
                children: [
                  /* @__PURE__ */ l(
                    "svg",
                    {
                      className: "w-4 h-4",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      children: /* @__PURE__ */ l(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: 2,
                          d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        }
                      )
                    }
                  ),
                  "Download"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ b(
          "div",
          {
            className: "relative bg-slate-100",
            style: { height: typeof a == "number" ? `${a}px` : a },
            children: [
              f && /* @__PURE__ */ l("div", { className: "absolute inset-0 flex items-center justify-center bg-slate-100", children: /* @__PURE__ */ l(
                M.div,
                {
                  className: "w-8 h-8 border-3 border-slate-300 border-t-blue-500 rounded-full",
                  animate: { rotate: 360 },
                  transition: { duration: 1, repeat: 1 / 0, ease: "linear" }
                }
              ) }),
              t === "pdf" ? /* @__PURE__ */ l(
                "iframe",
                {
                  src: `${e}#page=${d}`,
                  className: "w-full h-full border-0",
                  title: n || "Document viewer",
                  onLoad: () => m(!1)
                }
              ) : t === "image" ? /* @__PURE__ */ l(
                "img",
                {
                  src: e,
                  alt: n || "Document",
                  className: "w-full h-full object-contain",
                  onLoad: () => m(!1)
                }
              ) : /* @__PURE__ */ l(
                "iframe",
                {
                  src: e,
                  className: "w-full h-full border-0",
                  title: n || "Document viewer",
                  onLoad: () => m(!1)
                }
              )
            ]
          }
        )
      ]
    }
  );
}, dh = ({
  title: e,
  subtitle: t,
  type: n = "custom",
  height: s = 300,
  children: i,
  className: a = "",
  animate: r = !0,
  legend: o,
  timeRanges: c,
  currentTimeRange: u,
  onTimeRangeChange: d
}) => {
  const h = r ? M.div : "div", f = r ? { variants: wt, initial: "hidden", animate: "visible" } : {};
  return /* @__PURE__ */ b(
    h,
    {
      className: `
        bg-white rounded-xl border border-slate-200 overflow-hidden
        ${a}
      `,
      ...f,
      children: [
        (e || c) && /* @__PURE__ */ b("div", { className: "flex items-start justify-between px-5 pt-4 pb-2", children: [
          /* @__PURE__ */ b("div", { children: [
            e && /* @__PURE__ */ l("h3", { className: "text-base font-semibold text-slate-900", children: e }),
            t && /* @__PURE__ */ l("p", { className: "text-sm text-slate-500 mt-0.5", children: t })
          ] }),
          c && c.length > 0 && /* @__PURE__ */ l("div", { className: "flex items-center gap-1 bg-slate-100 rounded-lg p-1", children: c.map((m) => /* @__PURE__ */ l(
            "button",
            {
              onClick: () => d == null ? void 0 : d(m),
              className: `
                    px-3 py-1 text-xs font-medium rounded-md
                    transition-colors
                    ${u === m ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}
                  `,
              children: m
            },
            m
          )) })
        ] }),
        o && o.length > 0 && /* @__PURE__ */ l("div", { className: "flex items-center gap-4 px-5 pb-2", children: o.map((m) => /* @__PURE__ */ b("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ l(
            "div",
            {
              className: "w-3 h-3 rounded-full",
              style: { backgroundColor: m.color }
            }
          ),
          /* @__PURE__ */ l("span", { className: "text-xs text-slate-600", children: m.label })
        ] }, m.label)) }),
        /* @__PURE__ */ l(
          "div",
          {
            className: "px-5 pb-5",
            style: {
              height: typeof s == "number" ? `${s}px` : s
            },
            children: i
          }
        )
      ]
    }
  );
}, uh = ({
  fields: e,
  onSubmit: t,
  onCancel: n,
  layout: s = "vertical",
  submitLabel: i = "Submit",
  cancelLabel: a = "Cancel",
  title: r,
  isSubmitting: o = !1,
  className: c = "",
  animate: u = !0
}) => {
  const [d, h] = $(() => {
    const v = {};
    return e.forEach((x) => {
      v[x.name] = x.defaultValue || "";
    }), v;
  }), [f, m] = $({}), p = (v, x) => {
    h((T) => ({ ...T, [v]: x })), f[v] && m((T) => {
      const N = { ...T };
      return delete N[v], N;
    });
  }, g = () => {
    const v = {};
    return e.forEach((x) => {
      const T = d[x.name];
      x.required && !T.trim() ? v[x.name] = x.errorMessage || `${x.label} is required` : x.pattern && T && !x.pattern.test(T) && (v[x.name] = x.errorMessage || `Invalid ${x.label}`);
    }), m(v), Object.keys(v).length === 0;
  }, y = (v) => {
    v.preventDefault(), g() && t(d);
  }, w = u ? M.form : "form", k = u ? { variants: wt, initial: "hidden", animate: "visible" } : {}, S = (v) => {
    var C;
    const x = d[v.name], T = f[v.name], N = {
      id: v.name,
      name: v.name,
      placeholder: v.placeholder,
      disabled: o,
      className: `
        w-full px-3 py-2
        text-sm text-slate-900
        bg-white border rounded-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        disabled:bg-slate-50 disabled:text-slate-500
        ${T ? "border-red-300" : "border-slate-200"}
      `
    };
    switch (v.type) {
      case "select":
        return /* @__PURE__ */ b(
          "select",
          {
            ...N,
            value: x,
            onChange: (P) => p(v.name, P.target.value),
            children: [
              /* @__PURE__ */ l("option", { value: "", children: v.placeholder || "Select..." }),
              (C = v.options) == null ? void 0 : C.map((P) => /* @__PURE__ */ l("option", { value: P.value, children: P.label }, P.value))
            ]
          }
        );
      case "textarea":
        return /* @__PURE__ */ l(
          "textarea",
          {
            ...N,
            value: x,
            onChange: (P) => p(v.name, P.target.value),
            rows: 3
          }
        );
      default:
        return /* @__PURE__ */ l(
          "input",
          {
            ...N,
            type: v.type || "text",
            value: x,
            onChange: (P) => p(v.name, P.target.value)
          }
        );
    }
  };
  return /* @__PURE__ */ b(
    w,
    {
      onSubmit: y,
      className: `
        bg-white border border-slate-200 rounded-xl p-5
        ${c}
      `,
      ...k,
      children: [
        r && /* @__PURE__ */ l("h3", { className: "text-base font-semibold text-slate-900 mb-4", children: r }),
        /* @__PURE__ */ l(
          "div",
          {
            className: `
          ${s === "horizontal" ? "flex flex-wrap gap-4" : "space-y-4"}
        `,
            children: e.map((v) => /* @__PURE__ */ b(
              "div",
              {
                className: s === "horizontal" ? "flex-1 min-w-[200px]" : "",
                children: [
                  /* @__PURE__ */ b(
                    "label",
                    {
                      htmlFor: v.name,
                      className: "block text-sm font-medium text-slate-700 mb-1",
                      children: [
                        v.label,
                        v.required && /* @__PURE__ */ l("span", { className: "text-red-500 ml-1", children: "*" })
                      ]
                    }
                  ),
                  S(v),
                  f[v.name] && /* @__PURE__ */ l("p", { className: "text-xs text-red-500 mt-1", children: f[v.name] })
                ]
              },
              v.name
            ))
          }
        ),
        /* @__PURE__ */ b("div", { className: "flex items-center justify-end gap-3 mt-5 pt-4 border-t border-slate-100", children: [
          n && /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              onClick: n,
              disabled: o,
              className: `
              px-4 py-2 rounded-lg
              text-sm font-medium text-slate-600
              hover:bg-slate-100
              disabled:opacity-50
              transition-colors
            `,
              children: a
            }
          ),
          /* @__PURE__ */ b(
            "button",
            {
              type: "submit",
              disabled: o,
              className: `
            px-4 py-2 rounded-lg
            text-sm font-medium text-white
            bg-blue-600 hover:bg-blue-700
            disabled:opacity-50
            transition-colors
            flex items-center gap-2
          `,
              children: [
                o && /* @__PURE__ */ l(
                  M.div,
                  {
                    className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full",
                    animate: { rotate: 360 },
                    transition: { duration: 1, repeat: 1 / 0, ease: "linear" }
                  }
                ),
                i
              ]
            }
          )
        ] })
      ]
    }
  );
}, ru = {
  pending: {
    ring: "border-slate-200",
    bg: "bg-slate-100",
    text: "text-slate-400"
  },
  active: {
    ring: "border-blue-500",
    bg: "bg-blue-500",
    text: "text-white"
  },
  complete: {
    ring: "border-emerald-500",
    bg: "bg-emerald-500",
    text: "text-white"
  },
  error: {
    ring: "border-red-500",
    bg: "bg-red-500",
    text: "text-white"
  }
}, au = ({
  title: e,
  stepNumber: t,
  status: n = "pending",
  summary: s,
  children: i,
  isExpanded: a = !0,
  onToggle: r,
  showConnector: o = !0,
  className: c = ""
}) => {
  const u = ru[n], d = n !== "pending";
  return /* @__PURE__ */ b("div", { className: `relative ${c}`, children: [
    o && /* @__PURE__ */ l(
      "div",
      {
        className: `
            absolute left-5 top-10 w-0.5 h-[calc(100%-40px)]
            ${n === "complete" ? "bg-emerald-200" : "bg-slate-200"}
          `
      }
    ),
    /* @__PURE__ */ b(
      "div",
      {
        className: `
          flex items-start gap-4
          ${d && r ? "cursor-pointer" : ""}
        `,
        onClick: d ? r : void 0,
        children: [
          /* @__PURE__ */ l(
            "div",
            {
              className: `
            shrink-0 w-10 h-10 rounded-full
            flex items-center justify-center
            border-2 ${u.ring} ${u.bg}
            transition-colors
          `,
              children: n === "complete" ? /* @__PURE__ */ l("svg", { className: "w-5 h-5 text-white", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
                "path",
                {
                  fillRule: "evenodd",
                  d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                  clipRule: "evenodd"
                }
              ) }) : n === "error" ? /* @__PURE__ */ l("svg", { className: "w-5 h-5 text-white", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
                "path",
                {
                  fillRule: "evenodd",
                  d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                  clipRule: "evenodd"
                }
              ) }) : /* @__PURE__ */ l("span", { className: `text-sm font-semibold ${u.text}`, children: t })
            }
          ),
          /* @__PURE__ */ b("div", { className: "flex-1 min-w-0 pt-2", children: [
            /* @__PURE__ */ b("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ l(
                "h3",
                {
                  className: `
                text-base font-medium
                ${n === "pending" ? "text-slate-400" : "text-slate-900"}
              `,
                  children: e
                }
              ),
              d && r && /* @__PURE__ */ l(
                M.svg,
                {
                  className: "w-5 h-5 text-slate-400",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  animate: { rotate: a ? 180 : 0 },
                  transition: { duration: 0.2 },
                  children: /* @__PURE__ */ l(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M19 9l-7 7-7-7"
                    }
                  )
                }
              )
            ] }),
            !a && s && /* @__PURE__ */ l("p", { className: "text-sm text-slate-500 mt-1", children: s })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ l(J, { children: a && /* @__PURE__ */ l(
      M.div,
      {
        initial: { height: 0, opacity: 0 },
        animate: { height: "auto", opacity: 1 },
        exit: { height: 0, opacity: 0 },
        transition: { duration: 0.3 },
        className: "overflow-hidden",
        children: /* @__PURE__ */ l("div", { className: "ml-14 pt-4 pb-6", children: i })
      }
    ) })
  ] });
}, hh = ({
  steps: e,
  onComplete: t,
  initialData: n = {},
  onStepChange: s,
  className: i = "",
  showStepIndicators: a = !0
}) => {
  const [r, o] = $(0), [c, u] = $(n), [d, h] = $(/* @__PURE__ */ new Set()), [f, m] = $({}), p = (v) => {
    u((x) => ({ ...x, ...v }));
  }, g = (v) => f[v] ? "error" : d.has(v) ? "complete" : v === r ? "active" : "pending", y = (v) => {
    v >= 0 && v < e.length && (v <= r || d.has(v - 1)) && (o(v), s == null || s(v, e[v].id));
  }, S = {
    data: c,
    updateData: p,
    next: () => {
      const v = e[r];
      if (v.validate) {
        const x = v.validate(c);
        if (x !== !0) {
          m((T) => ({
            ...T,
            [r]: typeof x == "string" ? x : "Validation failed"
          }));
          return;
        }
      }
      if (m((x) => {
        const T = { ...x };
        return delete T[r], T;
      }), h((x) => /* @__PURE__ */ new Set([...x, r])), r < e.length - 1) {
        const x = r + 1;
        o(x), s == null || s(x, e[x].id);
      } else
        t(c);
    },
    prev: () => {
      if (r > 0) {
        const v = r - 1;
        o(v), s == null || s(v, e[v].id);
      }
    },
    isLast: r === e.length - 1,
    isFirst: r === 0
  };
  return /* @__PURE__ */ b("div", { className: i, children: [
    a && /* @__PURE__ */ l("div", { className: "flex items-center gap-2 mb-6", children: e.map((v, x) => {
      const T = g(x), N = T !== "pending";
      return /* @__PURE__ */ b(gt.Fragment, { children: [
        /* @__PURE__ */ b(
          "button",
          {
            onClick: () => y(x),
            disabled: !N,
            className: `
                    flex items-center gap-2 px-3 py-1.5 rounded-full
                    text-sm font-medium
                    transition-colors
                    ${T === "active" ? "bg-blue-100 text-blue-700" : T === "complete" ? "bg-emerald-100 text-emerald-700" : T === "error" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-400"}
                    ${N ? "cursor-pointer hover:opacity-80" : "cursor-default"}
                  `,
            children: [
              /* @__PURE__ */ l("span", { className: "w-5 h-5 rounded-full flex items-center justify-center text-xs bg-current/20", children: T === "complete" ? "✓" : x + 1 }),
              /* @__PURE__ */ l("span", { className: "hidden sm:inline", children: v.title })
            ]
          }
        ),
        x < e.length - 1 && /* @__PURE__ */ l(
          "div",
          {
            className: `
                      flex-1 h-0.5 max-w-8
                      ${d.has(x) ? "bg-emerald-300" : "bg-slate-200"}
                    `
          }
        )
      ] }, v.id);
    }) }),
    /* @__PURE__ */ l("div", { className: "space-y-0", children: e.map((v, x) => {
      var P;
      const T = g(x), N = x === r, C = (P = v.getSummary) == null ? void 0 : P.call(v, c);
      return /* @__PURE__ */ l(
        au,
        {
          title: v.title,
          stepNumber: x + 1,
          status: T,
          summary: C,
          isExpanded: N,
          onToggle: () => y(x),
          showConnector: x < e.length - 1,
          children: /* @__PURE__ */ b(
            M.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.1 },
              children: [
                v.content(S),
                f[x] && /* @__PURE__ */ l("p", { className: "text-sm text-red-500 mt-2", children: f[x] })
              ]
            }
          )
        },
        v.id
      );
    }) })
  ] });
}, ou = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-base",
  lg: "px-5 py-4 text-base"
}, fh = ({
  options: e,
  selected: t,
  onChange: n,
  multiple: s = !1,
  direction: i = "vertical",
  columns: a = 2,
  size: r = "md",
  className: o = ""
}) => {
  const c = new Set(Array.isArray(t) ? t : [t]), u = (m) => {
    if (s) {
      const p = Array.isArray(t) ? t : [t], g = c.has(m) ? p.filter((y) => y !== m) : [...p, m];
      n(g);
    } else
      n(m);
  }, d = (m) => c.has(m), f = {
    horizontal: "flex flex-wrap gap-2",
    vertical: "flex flex-col gap-2",
    grid: `grid ${{
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4"
    }[a]} gap-2`
  };
  return /* @__PURE__ */ l("div", { className: `${f[i]} ${o}`, children: e.map((m) => {
    const p = d(m.value);
    return /* @__PURE__ */ b(
      M.button,
      {
        type: "button",
        onClick: () => !m.disabled && u(m.value),
        whileHover: m.disabled ? void 0 : { scale: 1.02 },
        whileTap: m.disabled ? void 0 : { scale: 0.98 },
        disabled: m.disabled,
        className: `
              flex items-center gap-3
              ${ou[r]}
              rounded-xl border-2
              text-left
              transition-all
              ${p ? "border-blue-500 bg-blue-50 text-blue-900" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}
              ${m.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `,
        children: [
          /* @__PURE__ */ l(
            "div",
            {
              className: `
                shrink-0 w-5 h-5 rounded-full
                flex items-center justify-center
                border-2 transition-colors
                ${p ? "border-blue-500 bg-blue-500" : "border-slate-300 bg-white"}
              `,
              children: p && /* @__PURE__ */ l(
                M.svg,
                {
                  initial: { scale: 0 },
                  animate: { scale: 1 },
                  className: "w-3 h-3 text-white",
                  fill: "currentColor",
                  viewBox: "0 0 20 20",
                  children: /* @__PURE__ */ l(
                    "path",
                    {
                      fillRule: "evenodd",
                      d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                      clipRule: "evenodd"
                    }
                  )
                }
              )
            }
          ),
          m.icon && /* @__PURE__ */ l("span", { className: p ? "text-blue-600" : "text-slate-500", children: m.icon }),
          /* @__PURE__ */ b("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ l("span", { className: "font-medium", children: m.label }),
            m.description && /* @__PURE__ */ l(
              "p",
              {
                className: `
                    text-xs mt-0.5
                    ${p ? "text-blue-600" : "text-slate-500"}
                  `,
                children: m.description
              }
            )
          ] })
        ]
      },
      m.value
    );
  }) });
}, lu = {
  sm: { text: "text-sm", input: "px-2 py-1 text-sm", icon: "w-4 h-4" },
  md: { text: "text-base", input: "px-3 py-2 text-base", icon: "w-5 h-5" },
  lg: { text: "text-lg", input: "px-4 py-2.5 text-lg", icon: "w-5 h-5" }
}, mh = ({
  value: e,
  onSave: t,
  onCancel: n,
  error: s,
  placeholder: i = "Enter value",
  type: a = "text",
  size: r = "md",
  startEditing: o = !1,
  className: c = "",
  label: u,
  isSaving: d = !1
}) => {
  const [h, f] = $(o), [m, p] = $(e), g = B(null), y = lu[r];
  H(() => {
    h && g.current && (g.current.focus(), g.current.select());
  }, [h]), H(() => {
    p(e);
  }, [e]);
  const w = () => {
    f(!0), p(e);
  }, k = () => {
    m.trim() !== e && t(m.trim()), f(!1);
  }, S = () => {
    p(e), f(!1), n == null || n();
  }, v = (x) => {
    x.key === "Enter" ? (x.preventDefault(), k()) : x.key === "Escape" && S();
  };
  return /* @__PURE__ */ b("div", { className: c, children: [
    u && /* @__PURE__ */ l("span", { className: "block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1", children: u }),
    /* @__PURE__ */ l(J, { mode: "wait", children: h ? (
      // Edit mode
      /* @__PURE__ */ b(
        M.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "flex items-center gap-2",
          children: [
            /* @__PURE__ */ l(
              "input",
              {
                ref: g,
                type: a,
                value: m,
                onChange: (x) => p(x.target.value),
                onKeyDown: v,
                onBlur: k,
                placeholder: i,
                disabled: d,
                className: `
                flex-1 rounded-lg border
                ${s ? "border-red-300" : "border-slate-300"}
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                disabled:bg-slate-50 disabled:text-slate-500
                ${y.input}
              `
              }
            ),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                onClick: k,
                disabled: d,
                className: `
                p-2 rounded-lg
                text-emerald-600 hover:bg-emerald-50
                disabled:opacity-50
                transition-colors
              `,
                "aria-label": "Save",
                children: d ? /* @__PURE__ */ l(
                  M.div,
                  {
                    className: `${y.icon} border-2 border-emerald-600 border-t-transparent rounded-full`,
                    animate: { rotate: 360 },
                    transition: { duration: 1, repeat: 1 / 0, ease: "linear" }
                  }
                ) : /* @__PURE__ */ l("svg", { className: y.icon, fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
                  "path",
                  {
                    fillRule: "evenodd",
                    d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                    clipRule: "evenodd"
                  }
                ) })
              }
            ),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                onClick: S,
                disabled: d,
                className: `
                p-2 rounded-lg
                text-slate-400 hover:bg-slate-100 hover:text-slate-600
                disabled:opacity-50
                transition-colors
              `,
                "aria-label": "Cancel",
                children: /* @__PURE__ */ l("svg", { className: y.icon, fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
                  "path",
                  {
                    fillRule: "evenodd",
                    d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                    clipRule: "evenodd"
                  }
                ) })
              }
            )
          ]
        },
        "edit"
      )
    ) : (
      // Display mode
      /* @__PURE__ */ b(
        M.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: w,
          className: `
              group flex items-center gap-2
              cursor-pointer
              hover:bg-slate-50 rounded-lg
              -mx-2 px-2 py-1
              transition-colors
            `,
          children: [
            /* @__PURE__ */ l("span", { className: `${y.text} text-slate-900`, children: e || /* @__PURE__ */ l("span", { className: "text-slate-400", children: i }) }),
            /* @__PURE__ */ l(
              "svg",
              {
                className: `
                ${y.icon} text-slate-400
                opacity-0 group-hover:opacity-100
                transition-opacity
              `,
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ l(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  }
                )
              }
            )
          ]
        },
        "display"
      )
    ) }),
    s && /* @__PURE__ */ l("p", { className: "text-xs text-red-500 mt-1", children: s })
  ] });
}, cu = {
  sm: { circle: "w-6 h-6", text: "text-xs", lineWidth: "h-0.5", lineHeight: "w-0.5" },
  md: { circle: "w-8 h-8", text: "text-sm", lineWidth: "h-0.5", lineHeight: "w-0.5" },
  lg: { circle: "w-10 h-10", text: "text-base", lineWidth: "h-1", lineHeight: "w-1" }
}, du = {
  pending: { bg: "bg-slate-100", border: "border-slate-200", text: "text-slate-400" },
  active: { bg: "bg-blue-500", border: "border-blue-500", text: "text-white" },
  complete: { bg: "bg-emerald-500", border: "border-emerald-500", text: "text-white" },
  error: { bg: "bg-red-500", border: "border-red-500", text: "text-white" }
}, ph = ({
  steps: e,
  activeStep: t,
  orientation: n = "horizontal",
  onStepClick: s,
  size: i = "md",
  className: a = ""
}) => {
  const { circle: r, text: o, lineWidth: c, lineHeight: u } = cu[i], d = (f, m) => m.status ? m.status : f < t ? "complete" : f === t ? "active" : "pending", h = n === "vertical";
  return /* @__PURE__ */ l(
    "div",
    {
      className: `
        flex
        ${h ? "flex-col" : "flex-row items-center"}
        ${a}
      `,
      children: e.map((f, m) => {
        const p = d(m, f), g = du[p], y = s && p !== "pending", w = m === e.length - 1;
        return /* @__PURE__ */ b(gt.Fragment, { children: [
          /* @__PURE__ */ b(
            "div",
            {
              className: `
                flex
                ${h ? "flex-row items-start" : "flex-col items-center"}
                ${y ? "cursor-pointer" : ""}
              `,
              onClick: y ? () => s(m, f) : void 0,
              children: [
                /* @__PURE__ */ l(
                  M.div,
                  {
                    className: `
                  ${r} rounded-full
                  flex items-center justify-center
                  border-2 ${g.border} ${g.bg}
                  ${g.text}
                  font-semibold ${o}
                  transition-colors
                `,
                    whileHover: y ? { scale: 1.1 } : void 0,
                    whileTap: y ? { scale: 0.95 } : void 0,
                    children: p === "complete" ? /* @__PURE__ */ l("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
                      "path",
                      {
                        fillRule: "evenodd",
                        d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                        clipRule: "evenodd"
                      }
                    ) }) : p === "error" ? /* @__PURE__ */ l("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
                      "path",
                      {
                        fillRule: "evenodd",
                        d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                        clipRule: "evenodd"
                      }
                    ) }) : m + 1
                  }
                ),
                /* @__PURE__ */ b(
                  "div",
                  {
                    className: `
                  ${h ? "ml-3" : "mt-2 text-center"}
                `,
                    children: [
                      /* @__PURE__ */ l(
                        "span",
                        {
                          className: `
                    block font-medium ${o}
                    ${p === "pending" ? "text-slate-400" : "text-slate-900"}
                  `,
                          children: f.label
                        }
                      ),
                      f.description && /* @__PURE__ */ l("span", { className: "block text-xs text-slate-500 mt-0.5", children: f.description })
                    ]
                  }
                )
              ]
            }
          ),
          !w && /* @__PURE__ */ l(
            "div",
            {
              className: `
                  ${h ? `${u} h-8 ml-4 my-2` : `${c} flex-1 mx-3 min-w-8`}
                  ${m < t ? "bg-emerald-300" : "bg-slate-200"}
                  rounded-full
                  transition-colors
                `
            }
          )
        ] }, f.id);
      })
    }
  );
}, uu = {
  sm: { size: 32, stroke: 3, fontSize: "text-xs" },
  md: { size: 48, stroke: 4, fontSize: "text-sm" },
  lg: { size: 64, stroke: 5, fontSize: "text-base" },
  xl: { size: 96, stroke: 6, fontSize: "text-xl" }
}, gh = ({
  value: e,
  max: t = 100,
  size: n = "md",
  label: s,
  color: i = "#3b82f6",
  trackColor: a = "#e2e8f0",
  strokeWidth: r,
  className: o = "",
  animate: c = !0
}) => {
  const u = uu[n], d = r ?? u.stroke, h = u.size, f = (h - d) / 2, m = 2 * Math.PI * f, p = Math.min(Math.max(e / t, 0), 1), g = m * (1 - p), y = s ?? `${Math.round(p * 100)}%`;
  return /* @__PURE__ */ b(
    "div",
    {
      className: `relative inline-flex items-center justify-center ${o}`,
      style: { width: h, height: h },
      children: [
        /* @__PURE__ */ b(
          "svg",
          {
            className: "transform -rotate-90",
            width: h,
            height: h,
            viewBox: `0 0 ${h} ${h}`,
            children: [
              /* @__PURE__ */ l(
                "circle",
                {
                  cx: h / 2,
                  cy: h / 2,
                  r: f,
                  fill: "none",
                  stroke: a,
                  strokeWidth: d
                }
              ),
              /* @__PURE__ */ l(
                M.circle,
                {
                  cx: h / 2,
                  cy: h / 2,
                  r: f,
                  fill: "none",
                  stroke: i,
                  strokeWidth: d,
                  strokeLinecap: "round",
                  strokeDasharray: m,
                  initial: c ? { strokeDashoffset: m } : !1,
                  animate: { strokeDashoffset: g },
                  transition: { duration: 0.5, ease: "easeOut" }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ l(
          "div",
          {
            className: `
          absolute inset-0
          flex items-center justify-center
          ${u.fontSize} font-medium text-slate-700
        `,
            children: y
          }
        )
      ]
    }
  );
}, hu = {
  default: "bg-blue-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  gradient: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
}, fu = {
  sm: { height: "h-1", fontSize: "text-xs" },
  md: { height: "h-2", fontSize: "text-sm" },
  lg: { height: "h-3", fontSize: "text-sm" }
}, yh = ({
  value: e,
  max: t = 100,
  showLabel: n = !1,
  labelPosition: s = "right",
  variant: i = "default",
  size: a = "md",
  className: r = "",
  animate: o = !0,
  indeterminate: c = !1
}) => {
  const u = c ? 0 : Math.min(Math.max(e / t * 100, 0), 100), { height: d, fontSize: h } = fu[a], f = hu[i], m = `${Math.round(u)}%`;
  return /* @__PURE__ */ b("div", { className: r, children: [
    n && s === "top" && /* @__PURE__ */ b("div", { className: "flex justify-between mb-1", children: [
      /* @__PURE__ */ l("span", { className: `${h} text-slate-600`, children: "Progress" }),
      /* @__PURE__ */ l("span", { className: `${h} font-medium text-slate-700`, children: m })
    ] }),
    /* @__PURE__ */ b("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ l(
        "div",
        {
          className: `
            flex-1 ${d} rounded-full overflow-hidden
            bg-slate-200
          `,
          children: c ? (
            // Indeterminate animation
            /* @__PURE__ */ l(
              M.div,
              {
                className: `h-full w-1/3 rounded-full ${f}`,
                animate: {
                  x: ["-100%", "400%"]
                },
                transition: {
                  duration: 1.5,
                  repeat: 1 / 0,
                  ease: "easeInOut"
                }
              }
            )
          ) : (
            // Determinate progress
            /* @__PURE__ */ l(
              M.div,
              {
                className: `h-full rounded-full ${f}`,
                initial: o ? { width: 0 } : !1,
                animate: { width: `${u}%` },
                transition: { duration: 0.5, ease: "easeOut" }
              }
            )
          )
        }
      ),
      n && s === "right" && !c && /* @__PURE__ */ l("span", { className: `${h} font-medium text-slate-700 min-w-[3em] text-right`, children: m })
    ] }),
    n && s === "inside" && a === "lg" && !c && /* @__PURE__ */ l(
      "div",
      {
        className: "relative -mt-3 h-3 flex items-center",
        style: { paddingLeft: `${Math.max(u - 5, 0)}%` },
        children: /* @__PURE__ */ l("span", { className: "text-[10px] font-medium text-white drop-shadow", children: m })
      }
    )
  ] });
}, mu = {
  pending: {
    dot: "bg-slate-200 border-slate-300",
    line: "bg-slate-200",
    text: "text-slate-400"
  },
  active: {
    dot: "bg-blue-500 border-blue-500",
    line: "bg-slate-200",
    text: "text-blue-600",
    icon: /* @__PURE__ */ l(
      M.div,
      {
        className: "absolute inset-0 rounded-full bg-blue-500",
        animate: { scale: [1, 1.5, 1], opacity: [1, 0, 1] },
        transition: { duration: 2, repeat: 1 / 0 }
      }
    )
  },
  complete: {
    dot: "bg-emerald-500 border-emerald-500",
    line: "bg-emerald-300",
    text: "text-slate-700"
  },
  skipped: {
    dot: "bg-slate-100 border-slate-300",
    line: "bg-slate-200",
    text: "text-slate-400 line-through"
  }
}, xh = ({
  milestones: e,
  activeMilestone: t,
  onMilestoneClick: n,
  orientation: s = "vertical",
  className: i = ""
}) => {
  const a = s === "vertical", r = (c) => {
    if (c.status) return c.status;
    if (c.id === t) return "active";
    const u = e.findIndex((h) => h.id === t), d = e.findIndex((h) => h.id === c.id);
    return u !== -1 && d < u ? "complete" : "pending";
  }, o = (c) => typeof c == "string" ? c : c.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return /* @__PURE__ */ l(
    "div",
    {
      className: `
        flex
        ${a ? "flex-col" : "flex-row items-start"}
        ${i}
      `,
      children: e.map((c, u) => {
        const d = r(c), h = mu[d], f = u === e.length - 1, m = !!n;
        return /* @__PURE__ */ b(
          "div",
          {
            className: `
              flex
              ${a ? "flex-row" : "flex-col items-center flex-1"}
              ${m ? "cursor-pointer" : ""}
            `,
            onClick: m ? () => n(c) : void 0,
            children: [
              /* @__PURE__ */ b(
                "div",
                {
                  className: `
                flex shrink-0
                ${a ? "flex-col items-center" : "flex-row items-center"}
              `,
                  children: [
                    /* @__PURE__ */ b(
                      "div",
                      {
                        className: `
                  relative w-4 h-4 rounded-full
                  border-2 ${h.dot}
                  transition-colors
                `,
                        children: [
                          h.icon,
                          d === "complete" && /* @__PURE__ */ l(
                            "svg",
                            {
                              className: "absolute inset-0 w-full h-full text-white p-0.5",
                              fill: "currentColor",
                              viewBox: "0 0 20 20",
                              children: /* @__PURE__ */ l(
                                "path",
                                {
                                  fillRule: "evenodd",
                                  d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                                  clipRule: "evenodd"
                                }
                              )
                            }
                          )
                        ]
                      }
                    ),
                    !f && /* @__PURE__ */ l(
                      "div",
                      {
                        className: `
                    ${h.line}
                    ${a ? "w-0.5 flex-1 min-h-8" : "h-0.5 flex-1 min-w-8"}
                    transition-colors
                  `
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ b(
                "div",
                {
                  className: `
                ${a ? "ml-3 pb-6" : "mt-2 text-center px-2"}
                ${f && a ? "pb-0" : ""}
              `,
                  children: [
                    /* @__PURE__ */ l(
                      "span",
                      {
                        className: `
                  block font-medium text-sm
                  ${h.text}
                  transition-colors
                `,
                        children: c.label
                      }
                    ),
                    c.timestamp && /* @__PURE__ */ l("span", { className: "block text-xs text-slate-400 mt-0.5", children: o(c.timestamp) }),
                    c.description && /* @__PURE__ */ l("p", { className: "text-xs text-slate-500 mt-1", children: c.description })
                  ]
                }
              )
            ]
          },
          c.id
        );
      })
    }
  );
}, pu = {
  sm: { icon: "w-12 h-12", title: "text-lg", subtitle: "text-sm" },
  md: { icon: "w-16 h-16", title: "text-xl", subtitle: "text-base" },
  lg: { icon: "w-20 h-20", title: "text-2xl", subtitle: "text-lg" }
}, vh = ({
  title: e,
  subtitle: t,
  icon: n,
  actions: s = [],
  children: i,
  size: a = "md",
  className: r = ""
}) => {
  const { icon: o, title: c, subtitle: u } = pu[a], d = /* @__PURE__ */ l(
    "svg",
    {
      className: `${o} text-emerald-500`,
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: 2,
      children: /* @__PURE__ */ l(
        M.path,
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M5 13l4 4L19 7",
          initial: { pathLength: 0 },
          animate: { pathLength: 1 },
          transition: { duration: 0.5, delay: 0.2 }
        }
      )
    }
  );
  return /* @__PURE__ */ b(
    M.div,
    {
      className: `flex flex-col items-center text-center p-6 ${r}`,
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3 },
      children: [
        /* @__PURE__ */ l(
          M.div,
          {
            className: `
          ${o} rounded-full
          bg-emerald-50 flex items-center justify-center
          mb-4
        `,
            initial: { scale: 0 },
            animate: { scale: 1 },
            transition: { type: "spring", stiffness: 300, damping: 20 },
            children: n || d
          }
        ),
        /* @__PURE__ */ l(
          M.h3,
          {
            className: `${c} font-semibold text-slate-900 mb-2`,
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.2 },
            children: e
          }
        ),
        t && /* @__PURE__ */ l(
          M.p,
          {
            className: `${u} text-slate-500 mb-4 max-w-sm`,
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3 },
            children: t
          }
        ),
        i && /* @__PURE__ */ l(
          M.div,
          {
            className: "mb-4 w-full",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: 0.4 },
            children: i
          }
        ),
        s.length > 0 && /* @__PURE__ */ l(
          M.div,
          {
            className: "flex gap-3 mt-2",
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.5 },
            children: s.map((h, f) => /* @__PURE__ */ l(
              "button",
              {
                onClick: h.onClick,
                className: `
                px-4 py-2 rounded-lg font-medium text-sm
                transition-colors
                ${h.variant === "primary" ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}
              `,
                children: h.label
              },
              f
            ))
          }
        )
      ]
    }
  );
}, gu = {
  sm: { spinner: "w-6 h-6", message: "text-sm", estimated: "text-xs" },
  md: { spinner: "w-10 h-10", message: "text-base", estimated: "text-sm" },
  lg: { spinner: "w-14 h-14", message: "text-lg", estimated: "text-base" }
}, bh = ({
  message: e = "Please wait...",
  estimatedTime: t,
  onCancel: n,
  cancelLabel: s = "Cancel",
  variant: i = "spinner",
  size: a = "md",
  className: r = ""
}) => {
  const { spinner: o, message: c, estimated: u } = gu[a], d = () => {
    switch (i) {
      case "dots":
        return /* @__PURE__ */ l("div", { className: "flex gap-1", children: [0, 1, 2].map((h) => /* @__PURE__ */ l(
          M.div,
          {
            className: "w-2 h-2 rounded-full bg-blue-500",
            animate: { y: [0, -8, 0] },
            transition: {
              duration: 0.6,
              repeat: 1 / 0,
              delay: h * 0.15
            }
          },
          h
        )) });
      case "pulse":
        return /* @__PURE__ */ l(
          M.div,
          {
            className: `${o} rounded-full bg-blue-100`,
            animate: {
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            },
            transition: {
              duration: 1.5,
              repeat: 1 / 0
            },
            children: /* @__PURE__ */ l("div", { className: "w-full h-full rounded-full bg-blue-500 opacity-50" })
          }
        );
      case "spinner":
      default:
        return /* @__PURE__ */ l(
          M.div,
          {
            className: `${o} border-2 border-slate-200 border-t-blue-500 rounded-full`,
            animate: { rotate: 360 },
            transition: {
              duration: 1,
              repeat: 1 / 0,
              ease: "linear"
            }
          }
        );
    }
  };
  return /* @__PURE__ */ b(
    M.div,
    {
      className: `flex flex-col items-center text-center p-6 ${r}`,
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3 },
      children: [
        /* @__PURE__ */ l("div", { className: "mb-4", children: d() }),
        /* @__PURE__ */ l("p", { className: `${c} text-slate-700 mb-1`, children: e }),
        t && /* @__PURE__ */ b("p", { className: `${u} text-slate-400`, children: [
          "Estimated: ",
          t
        ] }),
        n && /* @__PURE__ */ l(
          M.button,
          {
            onClick: n,
            className: `
            mt-4 px-4 py-2 rounded-lg
            text-sm text-slate-600
            hover:bg-slate-100 transition-colors
          `,
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            children: s
          }
        )
      ]
    }
  );
}, yu = {
  sm: { icon: "w-10 h-10", title: "text-base", message: "text-sm" },
  md: { icon: "w-14 h-14", title: "text-lg", message: "text-base" },
  lg: { icon: "w-18 h-18", title: "text-xl", message: "text-lg" }
}, wh = ({
  title: e = "Error",
  message: t,
  onRetry: n,
  retryLabel: s = "Try Again",
  onDismiss: i,
  dismissLabel: a = "Dismiss",
  errorCode: r,
  icon: o,
  size: c = "md",
  variant: u = "full",
  className: d = ""
}) => {
  const { icon: h, title: f, message: m } = yu[c], p = /* @__PURE__ */ l(
    "svg",
    {
      className: `${h} text-red-500`,
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: 2,
      children: /* @__PURE__ */ l(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        }
      )
    }
  );
  return u === "inline" ? /* @__PURE__ */ b(
    M.div,
    {
      className: `
          flex items-start gap-3 p-4 rounded-lg
          bg-red-50 border border-red-200
          ${d}
        `,
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      children: [
        /* @__PURE__ */ l("div", { className: "shrink-0 text-red-500", children: /* @__PURE__ */ l("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
          "path",
          {
            fillRule: "evenodd",
            d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
            clipRule: "evenodd"
          }
        ) }) }),
        /* @__PURE__ */ b("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ l("p", { className: "text-sm font-medium text-red-800", children: e }),
          /* @__PURE__ */ l("p", { className: "text-sm text-red-600 mt-1", children: t }),
          (n || i) && /* @__PURE__ */ b("div", { className: "flex gap-2 mt-3", children: [
            n && /* @__PURE__ */ l(
              "button",
              {
                onClick: n,
                className: "text-sm font-medium text-red-700 hover:text-red-800",
                children: s
              }
            ),
            i && /* @__PURE__ */ l(
              "button",
              {
                onClick: i,
                className: "text-sm text-red-600 hover:text-red-700",
                children: a
              }
            )
          ] })
        ] })
      ]
    }
  ) : /* @__PURE__ */ b(
    M.div,
    {
      className: `flex flex-col items-center text-center p-6 ${d}`,
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3 },
      children: [
        /* @__PURE__ */ l(
          M.div,
          {
            className: `
          ${h} rounded-full
          bg-red-50 flex items-center justify-center
          mb-4
        `,
            initial: { scale: 0 },
            animate: { scale: 1 },
            transition: { type: "spring", stiffness: 300, damping: 20 },
            children: o || p
          }
        ),
        /* @__PURE__ */ l(
          M.h3,
          {
            className: `${f} font-semibold text-slate-900 mb-2`,
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.1 },
            children: e
          }
        ),
        /* @__PURE__ */ l(
          M.p,
          {
            className: `${m} text-slate-500 mb-4 max-w-sm`,
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.2 },
            children: t
          }
        ),
        r && /* @__PURE__ */ l(
          M.code,
          {
            className: "text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded mb-4",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: 0.3 },
            children: r
          }
        ),
        (n || i) && /* @__PURE__ */ b(
          M.div,
          {
            className: "flex gap-3",
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.4 },
            children: [
              n && /* @__PURE__ */ l(
                "button",
                {
                  onClick: n,
                  className: `
                px-4 py-2 rounded-lg font-medium text-sm
                bg-red-500 text-white hover:bg-red-600
                transition-colors
              `,
                  children: s
                }
              ),
              i && /* @__PURE__ */ l(
                "button",
                {
                  onClick: i,
                  className: `
                px-4 py-2 rounded-lg font-medium text-sm
                bg-slate-100 text-slate-700 hover:bg-slate-200
                transition-colors
              `,
                  children: a
                }
              )
            ]
          }
        )
      ]
    }
  );
}, Nh = ({
  retryAfter: e,
  onRetry: t,
  title: n = "Rate Limit Exceeded",
  message: s = "Too many requests. Please wait before trying again.",
  className: i = ""
}) => {
  const [a, r] = $(e), [o, c] = $(!1);
  H(() => {
    if (a <= 0) {
      c(!0);
      return;
    }
    const h = setInterval(() => {
      r((f) => f <= 1 ? (c(!0), clearInterval(h), 0) : f - 1);
    }, 1e3);
    return () => clearInterval(h);
  }, [a]);
  const u = D((h) => {
    if (h < 60)
      return `${h}s`;
    const f = Math.floor(h / 60), m = h % 60;
    return `${f}m ${m}s`;
  }, []), d = e > 0 ? (e - a) / e * 100 : 100;
  return /* @__PURE__ */ b(
    M.div,
    {
      className: `
        flex flex-col items-center text-center p-6
        bg-amber-50 border border-amber-200 rounded-lg
        ${i}
      `,
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      children: [
        /* @__PURE__ */ l(
          M.div,
          {
            className: "w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4",
            animate: o ? {} : { rotate: [0, 10, -10, 0] },
            transition: { duration: 0.5, repeat: o ? 0 : 1 / 0, repeatDelay: 2 },
            children: /* @__PURE__ */ l(
              "svg",
              {
                className: "w-6 h-6 text-amber-600",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                strokeWidth: 2,
                children: /* @__PURE__ */ l(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  }
                )
              }
            )
          }
        ),
        /* @__PURE__ */ l("h3", { className: "text-lg font-semibold text-amber-800 mb-2", children: n }),
        /* @__PURE__ */ l("p", { className: "text-sm text-amber-700 mb-4 max-w-sm", children: s }),
        !o && /* @__PURE__ */ b("div", { className: "w-full max-w-xs mb-4", children: [
          /* @__PURE__ */ l("div", { className: "h-2 bg-amber-200 rounded-full overflow-hidden mb-2", children: /* @__PURE__ */ l(
            M.div,
            {
              className: "h-full bg-amber-500 rounded-full",
              initial: { width: 0 },
              animate: { width: `${d}%` },
              transition: { duration: 0.5 }
            }
          ) }),
          /* @__PURE__ */ b("div", { className: "flex justify-between text-xs text-amber-600", children: [
            /* @__PURE__ */ l("span", { children: "Retry available in" }),
            /* @__PURE__ */ l("span", { className: "font-mono font-medium", children: u(a) })
          ] })
        ] }),
        t && /* @__PURE__ */ l(
          M.button,
          {
            onClick: o ? t : void 0,
            disabled: !o,
            className: `
            px-4 py-2 rounded-lg font-medium text-sm
            transition-all
            ${o ? "bg-amber-500 text-white hover:bg-amber-600 cursor-pointer" : "bg-amber-200 text-amber-400 cursor-not-allowed"}
          `,
            whileHover: o ? { scale: 1.02 } : {},
            whileTap: o ? { scale: 0.98 } : {},
            children: o ? "Retry Now" : `Wait ${u(a)}`
          }
        )
      ]
    }
  );
}, xu = {
  sm: { button: "w-7 h-7", icon: "w-4 h-4", gap: "gap-1" },
  md: { button: "w-9 h-9", icon: "w-5 h-5", gap: "gap-2" },
  lg: { button: "w-11 h-11", icon: "w-6 h-6", gap: "gap-3" }
}, vu = ["😞", "😐", "🙂", "😊", "😍"], Th = ({
  type: e = "thumbs",
  onSubmit: t,
  showComment: n = !1,
  commentPlaceholder: s = "Any additional feedback?",
  value: i,
  size: a = "md",
  className: r = ""
}) => {
  const [o, c] = $(
    i ?? null
  ), [u, d] = $(""), [h, f] = $(!1), [m, p] = $(!1), { button: g, icon: y, gap: w } = xu[a], k = (N) => {
    c(N), n ? f(!0) : S(N);
  }, S = (N) => {
    const C = N ?? o;
    C !== null && (t == null || t(C, u || void 0), p(!0));
  };
  if (m)
    return /* @__PURE__ */ b(
      M.div,
      {
        className: `flex items-center gap-2 text-sm text-slate-500 ${r}`,
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        children: [
          /* @__PURE__ */ l("svg", { className: "w-4 h-4 text-emerald-500", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
            "path",
            {
              fillRule: "evenodd",
              d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
              clipRule: "evenodd"
            }
          ) }),
          "Thanks for your feedback!"
        ]
      }
    );
  const v = () => /* @__PURE__ */ b("div", { className: `flex ${w}`, children: [
    /* @__PURE__ */ l(
      M.button,
      {
        onClick: () => k("positive"),
        className: `
          ${g} rounded-lg flex items-center justify-center
          transition-colors
          ${o === "positive" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"}
        `,
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.95 },
        "aria-label": "Thumbs up",
        children: /* @__PURE__ */ l("svg", { className: y, fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l("path", { d: "M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" }) })
      }
    ),
    /* @__PURE__ */ l(
      M.button,
      {
        onClick: () => k("negative"),
        className: `
          ${g} rounded-lg flex items-center justify-center
          transition-colors
          ${o === "negative" ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"}
        `,
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.95 },
        "aria-label": "Thumbs down",
        children: /* @__PURE__ */ l("svg", { className: y, fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l("path", { d: "M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" }) })
      }
    )
  ] }), x = () => /* @__PURE__ */ l("div", { className: `flex ${w}`, children: [1, 2, 3, 4, 5].map((N) => /* @__PURE__ */ l(
    M.button,
    {
      onClick: () => k(N),
      className: `
            ${g} rounded-lg flex items-center justify-center
            transition-colors
            ${o !== null && N <= o ? "bg-amber-100 text-amber-500" : "bg-slate-100 text-slate-300 hover:bg-slate-200 hover:text-amber-400"}
          `,
      whileHover: { scale: 1.1 },
      whileTap: { scale: 0.95 },
      "aria-label": `Rate ${N} star${N > 1 ? "s" : ""}`,
      children: /* @__PURE__ */ l("svg", { className: y, fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" }) })
    },
    N
  )) }), T = () => /* @__PURE__ */ l("div", { className: `flex ${w}`, children: vu.map((N, C) => /* @__PURE__ */ l(
    M.button,
    {
      onClick: () => k(N),
      className: `
            ${g} rounded-lg flex items-center justify-center text-xl
            transition-colors
            ${o === N ? "bg-blue-100 ring-2 ring-blue-400" : "bg-slate-100 hover:bg-slate-200"}
          `,
      whileHover: { scale: 1.2 },
      whileTap: { scale: 0.95 },
      "aria-label": `React with ${N}`,
      children: N
    },
    C
  )) });
  return /* @__PURE__ */ b("div", { className: r, children: [
    e === "thumbs" && v(),
    e === "rating" && x(),
    e === "emoji" && T(),
    /* @__PURE__ */ l(J, { children: h && /* @__PURE__ */ b(
      M.div,
      {
        className: "mt-3",
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: "auto" },
        exit: { opacity: 0, height: 0 },
        children: [
          /* @__PURE__ */ l(
            "textarea",
            {
              value: u,
              onChange: (N) => d(N.target.value),
              placeholder: s,
              className: "w-full p-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500",
              rows: 2
            }
          ),
          /* @__PURE__ */ l(
            "button",
            {
              onClick: () => S(),
              className: "mt-2 px-3 py-1.5 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors",
              children: "Submit"
            }
          )
        ]
      }
    ) })
  ] });
}, bu = [
  "Bug Report",
  "Feature Request",
  "Question",
  "Account Issue",
  "Other"
], kh = ({
  onSubmit: e,
  isSubmitting: t = !1,
  issueTypes: n = bu,
  showEmail: s = !1,
  showPriority: i = !1,
  title: a = "Need Help?",
  submitLabel: r = "Submit",
  className: o = ""
}) => {
  const [c, u] = $(!1), [d, h] = $(!1), [f, m] = $({
    type: "",
    description: "",
    email: "",
    priority: "medium"
  }), p = async (y) => {
    y.preventDefault(), !(!f.type || !f.description) && (await e(f), h(!0), setTimeout(() => {
      h(!1), u(!1), m({
        type: "",
        description: "",
        email: "",
        priority: "medium"
      });
    }, 2e3));
  }, g = (y, w) => {
    m((k) => ({ ...k, [y]: w }));
  };
  return /* @__PURE__ */ b("div", { className: o, children: [
    /* @__PURE__ */ b(
      "button",
      {
        onClick: () => u(!c),
        className: "flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors",
        children: [
          /* @__PURE__ */ l(
            "svg",
            {
              className: "w-4 h-4",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              strokeWidth: 2,
              children: /* @__PURE__ */ l(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                }
              )
            }
          ),
          a,
          /* @__PURE__ */ l(
            M.svg,
            {
              className: "w-3 h-3",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              strokeWidth: 2,
              animate: { rotate: c ? 180 : 0 },
              children: /* @__PURE__ */ l("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ l(J, { children: c && /* @__PURE__ */ l(
      M.div,
      {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: "auto" },
        exit: { opacity: 0, height: 0 },
        className: "overflow-hidden",
        children: /* @__PURE__ */ l("div", { className: "pt-4", children: d ? /* @__PURE__ */ b(
          M.div,
          {
            className: "flex flex-col items-center text-center p-4 bg-emerald-50 rounded-lg",
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            children: [
              /* @__PURE__ */ l(
                "svg",
                {
                  className: "w-8 h-8 text-emerald-500 mb-2",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  strokeWidth: 2,
                  children: /* @__PURE__ */ l(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      d: "M5 13l4 4L19 7"
                    }
                  )
                }
              ),
              /* @__PURE__ */ l("p", { className: "font-medium text-emerald-700", children: "Request Submitted!" }),
              /* @__PURE__ */ l("p", { className: "text-sm text-emerald-600", children: "We'll get back to you soon." })
            ]
          }
        ) : /* @__PURE__ */ b("form", { onSubmit: p, className: "space-y-4", children: [
          /* @__PURE__ */ b("div", { children: [
            /* @__PURE__ */ l("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Issue Type" }),
            /* @__PURE__ */ b(
              "select",
              {
                value: f.type,
                onChange: (y) => g("type", y.target.value),
                className: "w-full p-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                required: !0,
                children: [
                  /* @__PURE__ */ l("option", { value: "", children: "Select an issue type" }),
                  n.map((y) => /* @__PURE__ */ l("option", { value: y, children: y }, y))
                ]
              }
            )
          ] }),
          s && /* @__PURE__ */ b("div", { children: [
            /* @__PURE__ */ l("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Email" }),
            /* @__PURE__ */ l(
              "input",
              {
                type: "email",
                value: f.email,
                onChange: (y) => g("email", y.target.value),
                placeholder: "your@email.com",
                className: "w-full p-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              }
            )
          ] }),
          i && /* @__PURE__ */ b("div", { children: [
            /* @__PURE__ */ l("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Priority" }),
            /* @__PURE__ */ l("div", { className: "flex gap-2", children: ["low", "medium", "high"].map((y) => /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                onClick: () => g("priority", y),
                className: `
                              flex-1 py-1.5 text-sm font-medium rounded-lg
                              transition-colors capitalize
                              ${f.priority === y ? y === "high" ? "bg-red-100 text-red-700" : y === "medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}
                            `,
                children: y
              },
              y
            )) })
          ] }),
          /* @__PURE__ */ b("div", { children: [
            /* @__PURE__ */ l("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Description" }),
            /* @__PURE__ */ l(
              "textarea",
              {
                value: f.description,
                onChange: (y) => g("description", y.target.value),
                placeholder: "Describe your issue or question...",
                className: "w-full p-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500",
                rows: 3,
                required: !0
              }
            )
          ] }),
          /* @__PURE__ */ l(
            "button",
            {
              type: "submit",
              disabled: t || !f.type || !f.description,
              className: `
                      w-full py-2 px-4 rounded-lg font-medium text-sm
                      transition-colors
                      ${t || !f.type || !f.description ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}
                    `,
              children: t ? /* @__PURE__ */ b("span", { className: "flex items-center justify-center gap-2", children: [
                /* @__PURE__ */ l(
                  M.span,
                  {
                    className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full",
                    animate: { rotate: 360 },
                    transition: { duration: 1, repeat: 1 / 0, ease: "linear" }
                  }
                ),
                "Submitting..."
              ] }) : r
            }
          )
        ] }) })
      }
    ) })
  ] });
}, Sh = ({
  title: e = "How can I help you?",
  subtitle: t,
  suggestions: n = [],
  onSuggestionClick: s,
  logo: i,
  className: a = "",
  animate: r = !0
}) => {
  const o = r ? M.div : "div", c = r ? { variants: Ee, initial: "hidden", animate: "visible" } : {}, u = r ? M.div : "div", d = r ? { variants: Je } : {};
  return /* @__PURE__ */ b(
    o,
    {
      className: `
        flex flex-col items-center justify-center
        px-6 py-12
        text-center
        ${a}
      `,
      ...c,
      children: [
        /* @__PURE__ */ l(u, { ...d, children: i || /* @__PURE__ */ l(Nt, { size: "xl", className: "mb-6" }) }),
        /* @__PURE__ */ l(u, { ...d, children: /* @__PURE__ */ l("h1", { className: "text-2xl font-semibold text-slate-900 mb-2", children: e }) }),
        t && /* @__PURE__ */ l(u, { ...d, children: /* @__PURE__ */ l("p", { className: "text-base text-slate-500 mb-8 max-w-md", children: t }) }),
        n.length > 0 && /* @__PURE__ */ l(u, { ...d, className: "w-full max-w-lg", children: /* @__PURE__ */ l("div", { className: "flex flex-col gap-2", children: n.map((h, f) => /* @__PURE__ */ b(
          M.button,
          {
            onClick: () => s == null ? void 0 : s(h),
            initial: r ? { opacity: 0, y: 10 } : void 0,
            animate: r ? { opacity: 1, y: 0 } : void 0,
            transition: r ? { delay: 0.3 + f * 0.1 } : void 0,
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            className: `
                  flex items-center gap-3
                  w-full px-4 py-3
                  text-left text-sm text-slate-700
                  bg-white border border-slate-200 rounded-xl
                  hover:border-slate-300 hover:bg-slate-50
                  transition-colors
                  shadow-sm
                `,
            children: [
              h.icon && /* @__PURE__ */ l("span", { className: "text-slate-400", children: h.icon }),
              /* @__PURE__ */ l("span", { children: h.label }),
              /* @__PURE__ */ l(
                "svg",
                {
                  className: "w-4 h-4 text-slate-400 ml-auto",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  children: /* @__PURE__ */ l(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M9 5l7 7-7 7"
                    }
                  )
                }
              )
            ]
          },
          h.id
        )) }) })
      ]
    }
  );
}, wu = {
  "1:1": { left: "flex-1", right: "flex-1" },
  "1:2": { left: "w-1/3", right: "w-2/3" },
  "2:1": { left: "w-2/3", right: "w-1/3" },
  "1:3": { left: "w-1/4", right: "w-3/4" },
  "3:1": { left: "w-3/4", right: "w-1/4" }
}, Nu = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6"
}, Ch = ({
  left: e,
  right: t,
  ratio: n = "1:1",
  collapsible: s = !1,
  defaultCollapsed: i = !1,
  collapsed: a,
  onCollapsedChange: r,
  minWidth: o = 300,
  gap: c = "md",
  className: u = ""
}) => {
  const [d, h] = $(i), f = a ?? d, m = () => {
    const y = !f;
    h(y), r == null || r(y);
  }, { left: p, right: g } = wu[n];
  return /* @__PURE__ */ b("div", { className: `flex h-full ${Nu[c]} ${u}`, children: [
    /* @__PURE__ */ l(
      "div",
      {
        className: `
          h-full overflow-hidden
          ${f ? "flex-1" : p}
          transition-all duration-300
        `,
        style: { minWidth: f ? void 0 : o },
        children: e
      }
    ),
    /* @__PURE__ */ l(J, { children: !f && /* @__PURE__ */ b(
      M.div,
      {
        initial: { width: 0, opacity: 0 },
        animate: { width: "auto", opacity: 1 },
        exit: { width: 0, opacity: 0 },
        transition: { duration: 0.3, ease: "easeInOut" },
        className: `
              h-full overflow-hidden
              ${g}
              relative
            `,
        style: { minWidth: o },
        children: [
          s && /* @__PURE__ */ l(
            "button",
            {
              onClick: m,
              className: `
                  absolute top-4 left-0 z-10
                  w-6 h-12 -ml-3
                  flex items-center justify-center
                  bg-white border border-slate-200 rounded-r-lg
                  text-slate-400 hover:text-slate-600
                  shadow-sm
                  transition-colors
                `,
              "aria-label": "Collapse panel",
              children: /* @__PURE__ */ l(
                "svg",
                {
                  className: "w-4 h-4",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  children: /* @__PURE__ */ l(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M9 5l7 7-7 7"
                    }
                  )
                }
              )
            }
          ),
          t
        ]
      }
    ) }),
    s && f && /* @__PURE__ */ l(
      "button",
      {
        onClick: m,
        className: `
            shrink-0
            w-8 h-full
            flex items-center justify-center
            bg-slate-50 border-l border-slate-200
            text-slate-400 hover:text-slate-600 hover:bg-slate-100
            transition-colors
          `,
        "aria-label": "Expand panel",
        children: /* @__PURE__ */ l(
          "svg",
          {
            className: "w-4 h-4",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /* @__PURE__ */ l(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M15 19l-7-7 7-7"
              }
            )
          }
        )
      }
    )
  ] });
}, Tu = {
  right: {
    sm: "w-80",
    md: "w-96",
    lg: "w-[480px]",
    xl: "w-[600px]",
    full: "w-full"
  },
  left: {
    sm: "w-80",
    md: "w-96",
    lg: "w-[480px]",
    xl: "w-[600px]",
    full: "w-full"
  },
  bottom: {
    sm: "h-48",
    md: "h-64",
    lg: "h-96",
    xl: "h-[500px]",
    full: "h-full"
  },
  center: {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl"
  }
}, ku = {
  right: "fixed top-0 right-0 h-full",
  left: "fixed top-0 left-0 h-full",
  bottom: "fixed bottom-0 left-0 right-0",
  center: "fixed inset-0 flex items-center justify-center p-4"
}, Su = {
  right: {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.2 } }
  },
  left: {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { x: "-100%", opacity: 0, transition: { duration: 0.2 } }
  },
  bottom: {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { y: "100%", opacity: 0, transition: { duration: 0.2 } }
  },
  center: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { scale: 0.95, opacity: 0, transition: { duration: 0.2 } }
  }
}, Mh = ({
  isOpen: e,
  onClose: t,
  position: n = "right",
  size: s = "md",
  title: i,
  children: a,
  showOverlay: r = !0,
  closeOnOverlayClick: o = !0,
  showCloseButton: c = !0,
  className: u = ""
}) => {
  const d = () => {
    o && t();
  }, h = Su[n], f = Tu[n][s], m = ku[n];
  return /* @__PURE__ */ l(J, { children: e && /* @__PURE__ */ b(be, { children: [
    r && /* @__PURE__ */ l(
      M.div,
      {
        variants: zd,
        initial: "hidden",
        animate: "visible",
        exit: "exit",
        className: "fixed inset-0 bg-black/50 z-40",
        onClick: d
      },
      "overlay"
    ),
    /* @__PURE__ */ l(
      M.div,
      {
        variants: h,
        initial: "initial",
        animate: "animate",
        exit: "exit",
        className: `
              z-50
              ${m}
              ${n !== "center" ? f : ""}
            `,
        children: /* @__PURE__ */ b(
          "div",
          {
            className: `
                ${n === "center" ? `w-full ${f}` : "h-full"}
                bg-white
                ${n === "bottom" ? "rounded-t-2xl" : ""}
                ${n === "center" ? "rounded-xl" : ""}
                shadow-xl
                flex flex-col
                overflow-hidden
                ${u}
              `,
            children: [
              (i || c) && /* @__PURE__ */ b("div", { className: "flex items-center justify-between px-5 py-4 border-b border-slate-100", children: [
                i && /* @__PURE__ */ l("h2", { className: "text-lg font-semibold text-slate-900", children: i }),
                c && /* @__PURE__ */ l(
                  "button",
                  {
                    onClick: t,
                    className: `
                        p-2 -m-2 rounded-lg
                        text-slate-400 hover:text-slate-600 hover:bg-slate-100
                        transition-colors
                      `,
                    "aria-label": "Close",
                    children: /* @__PURE__ */ l(
                      "svg",
                      {
                        className: "w-5 h-5",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /* @__PURE__ */ l(
                          "path",
                          {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M6 18L18 6M6 6l12 12"
                          }
                        )
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ l("div", { className: "flex-1 overflow-auto blade-ai-scrollbar", children: a })
            ]
          }
        )
      },
      "panel"
    )
  ] }) });
}, Cu = {
  sm: {
    button: "w-7 h-7",
    icon: "w-3.5 h-3.5",
    gap: "gap-1"
  },
  md: {
    button: "w-8 h-8",
    icon: "w-4 h-4",
    gap: "gap-1.5"
  }
}, Ph = ({
  onCopy: e,
  onShare: t,
  onThumbsUp: n,
  onThumbsDown: s,
  onRegenerate: i,
  feedback: a,
  showCopy: r = !0,
  showShare: o = !1,
  showFeedback: c = !0,
  showRegenerate: u = !1,
  className: d = "",
  size: h = "md"
}) => {
  const [f, m] = $(!1), { button: p, icon: g, gap: y } = Cu[h], w = () => {
    e == null || e(), m(!0), setTimeout(() => m(!1), 2e3);
  }, k = ({ onClick: S, active: v, activeColor: x = "text-blue-600", tooltip: T, children: N }) => /* @__PURE__ */ l(
    M.button,
    {
      onClick: S,
      whileHover: { scale: 1.1 },
      whileTap: { scale: 0.9 },
      className: `
        ${p}
        flex items-center justify-center
        rounded-lg
        transition-colors
        ${v ? `${x} bg-slate-100` : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}
      `,
      title: T,
      children: N
    }
  );
  return /* @__PURE__ */ b("div", { className: `flex items-center ${y} ${d}`, children: [
    r && e && /* @__PURE__ */ l(k, { onClick: w, active: f, tooltip: f ? "Copied!" : "Copy", children: f ? /* @__PURE__ */ l("svg", { className: g, fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ l(
      "path",
      {
        fillRule: "evenodd",
        d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
        clipRule: "evenodd"
      }
    ) }) : /* @__PURE__ */ l("svg", { className: g, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      }
    ) }) }),
    o && t && /* @__PURE__ */ l(k, { onClick: t, tooltip: "Share", children: /* @__PURE__ */ l("svg", { className: g, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      }
    ) }) }),
    u && i && /* @__PURE__ */ l(k, { onClick: i, tooltip: "Regenerate", children: /* @__PURE__ */ l("svg", { className: g, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      }
    ) }) }),
    c && (e || t || i) && /* @__PURE__ */ l("div", { className: "w-px h-4 bg-slate-200 mx-1" }),
    c && n && /* @__PURE__ */ l(
      k,
      {
        onClick: n,
        active: a === "up",
        activeColor: "text-emerald-600",
        tooltip: "Good response",
        children: /* @__PURE__ */ l("svg", { className: g, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          }
        ) })
      }
    ),
    c && s && /* @__PURE__ */ l(
      k,
      {
        onClick: s,
        active: a === "down",
        activeColor: "text-red-600",
        tooltip: "Bad response",
        children: /* @__PURE__ */ l("svg", { className: g, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ l(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
          }
        ) })
      }
    )
  ] });
}, Mu = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm"
}, Ah = ({
  suggestions: e,
  onClick: t,
  numbered: n = !1,
  stagger: s = !0,
  direction: i = "vertical",
  maxVisible: a,
  highlightedIndex: r = null,
  className: o = "",
  size: c = "md"
}) => {
  const u = a ? e.slice(0, a) : e, d = s ? M.div : "div", h = s ? { variants: Ee, initial: "hidden", animate: "visible" } : {}, f = s ? M.button : "button", m = (p) => s ? {
    variants: Je,
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 }
  } : {};
  return /* @__PURE__ */ b(
    d,
    {
      className: `
        flex
        ${i === "horizontal" ? "flex-wrap gap-2" : "flex-col gap-1"}
        ${o}
      `,
      ...h,
      children: [
        u.map((p, g) => {
          const y = r === g;
          return /* @__PURE__ */ b(
            f,
            {
              onClick: () => t(p, g),
              className: `
              text-left
              ${Mu[c]}
              font-medium rounded-lg
              transition-colors
              ${y ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}
            `,
              ...m(),
              children: [
                n && /* @__PURE__ */ b(
                  "span",
                  {
                    className: `
                  mr-2
                  ${y ? "text-blue-500" : "text-slate-400"}
                `,
                    children: [
                      g + 1,
                      "."
                    ]
                  }
                ),
                p
              ]
            },
            g
          );
        }),
        a && e.length > a && /* @__PURE__ */ b("span", { className: "text-xs text-slate-400 px-3 py-1", children: [
          "+",
          e.length - a,
          " more"
        ] })
      ]
    }
  );
}, Lh = ({
  variant: e = "assistant",
  lines: t = 3,
  animate: n = "shimmer",
  showAvatar: s = !0,
  className: i = ""
}) => {
  const a = e === "user", r = n === "shimmer" ? "blade-ai-shimmer-bg" : n === "pulse" ? "animate-pulse" : "", o = [
    "100%",
    "85%",
    "70%",
    "90%",
    "60%",
    "75%"
  ];
  return /* @__PURE__ */ b(
    "div",
    {
      className: `
        flex gap-3
        ${a ? "flex-row-reverse" : "flex-row"}
        ${i}
      `,
      children: [
        s && /* @__PURE__ */ l(
          "div",
          {
            className: `
            shrink-0 w-8 h-8 rounded-full bg-slate-200
            ${r}
          `
          }
        ),
        /* @__PURE__ */ l(
          "div",
          {
            className: `
          flex flex-col gap-2
          ${a ? "items-end" : "items-start"}
          max-w-[70%]
        `,
            children: Array.from({ length: t }).map((c, u) => /* @__PURE__ */ l(
              "div",
              {
                className: `
              h-4 rounded bg-slate-200
              ${r}
            `,
                style: {
                  width: o[u % o.length],
                  minWidth: "100px"
                }
              },
              u
            ))
          }
        )
      ]
    }
  );
}, Vh = ({
  rows: e = 3,
  showHeader: t = !0,
  showActions: n = !1,
  animate: s = "shimmer",
  className: i = ""
}) => {
  const a = s === "shimmer" ? "blade-ai-shimmer-bg" : s === "pulse" ? "animate-pulse" : "";
  return /* @__PURE__ */ b(
    "div",
    {
      className: `
        bg-white rounded-xl border border-slate-200 overflow-hidden
        ${i}
      `,
      children: [
        t && /* @__PURE__ */ b("div", { className: "px-5 py-4 border-b border-slate-100", children: [
          /* @__PURE__ */ l("div", { className: `h-5 w-40 bg-slate-200 rounded ${a}` }),
          /* @__PURE__ */ l("div", { className: `h-4 w-24 bg-slate-100 rounded mt-2 ${a}` })
        ] }),
        /* @__PURE__ */ l("div", { className: "px-5 py-4 grid grid-cols-2 gap-4", children: Array.from({ length: e }).map((r, o) => /* @__PURE__ */ b("div", { className: "space-y-2", children: [
          /* @__PURE__ */ l("div", { className: `h-3 w-16 bg-slate-100 rounded ${a}` }),
          /* @__PURE__ */ l(
            "div",
            {
              className: `h-4 bg-slate-200 rounded ${a}`,
              style: { width: `${60 + Math.random() * 40}%` }
            }
          )
        ] }, o)) }),
        n && /* @__PURE__ */ b("div", { className: "px-5 py-3 border-t border-slate-100 flex justify-end gap-2", children: [
          /* @__PURE__ */ l("div", { className: `h-9 w-20 bg-slate-100 rounded-lg ${a}` }),
          /* @__PURE__ */ l("div", { className: `h-9 w-24 bg-slate-200 rounded-lg ${a}` })
        ] })
      ]
    }
  );
}, Dh = ({
  columns: e = 4,
  rows: t = 5,
  showHeader: n = !0,
  animate: s = "shimmer",
  className: i = ""
}) => {
  const a = s === "shimmer" ? "blade-ai-shimmer-bg" : s === "pulse" ? "animate-pulse" : "", r = (o, c) => {
    if (c) return "60%";
    const u = ["80%", "60%", "90%", "70%", "50%"];
    return u[(o * 3 + t) % u.length];
  };
  return /* @__PURE__ */ l("div", { className: `overflow-hidden rounded-lg border border-slate-200 ${i}`, children: /* @__PURE__ */ b("table", { className: "w-full", children: [
    n && /* @__PURE__ */ l("thead", { children: /* @__PURE__ */ l("tr", { className: "border-b border-slate-200 bg-slate-50", children: Array.from({ length: e }).map((o, c) => /* @__PURE__ */ l("th", { className: "px-4 py-3 text-left", children: /* @__PURE__ */ l(
      "div",
      {
        className: `h-4 bg-slate-200 rounded ${a}`,
        style: { width: r(c, !0) }
      }
    ) }, c)) }) }),
    /* @__PURE__ */ l("tbody", { children: Array.from({ length: t }).map((o, c) => /* @__PURE__ */ l(
      "tr",
      {
        className: "border-b border-slate-100 last:border-b-0",
        children: Array.from({ length: e }).map((u, d) => /* @__PURE__ */ l("td", { className: "px-4 py-3", children: /* @__PURE__ */ l(
          "div",
          {
            className: `h-4 bg-slate-100 rounded ${a}`,
            style: {
              width: r(d + c, !1),
              animationDelay: s === "shimmer" ? `${(c * 100 + d * 50) % 500}ms` : void 0
            }
          }
        ) }, d))
      },
      c
    )) })
  ] }) });
}, Pu = {
  sm: "h-3",
  md: "h-4",
  lg: "h-5"
}, $h = ({
  lines: e = 3,
  width: t,
  lineHeight: n = "md",
  animate: s = "shimmer",
  natural: i = !0,
  className: a = ""
}) => {
  const r = s === "shimmer" ? "blade-ai-shimmer-bg" : s === "pulse" ? "animate-pulse" : "", o = Pu[n], c = ["100%", "95%", "85%", "90%", "70%", "80%", "60%"], u = (d) => t !== void 0 ? typeof t == "number" ? `${t}px` : t : i ? d === e - 1 ? c[(d + 4) % c.length] : c[d % c.length] : "100%";
  return /* @__PURE__ */ l("div", { className: `flex flex-col gap-2 ${a}`, children: Array.from({ length: e }).map((d, h) => /* @__PURE__ */ l(
    "div",
    {
      className: `${o} bg-slate-200 rounded ${r}`,
      style: {
        width: u(h),
        animationDelay: s === "shimmer" ? `${h * 100}ms` : void 0
      }
    },
    h
  )) });
};
function Rh(e = {}) {
  const { speed: t = 30, onComplete: n, autoStart: s = !1 } = e, [i, a] = $(""), [r, o] = $(!1), [c, u] = $(!1), d = B(""), h = B(0), f = B(null), m = D(() => {
    f.current && (globalThis.clearInterval(f.current), f.current = null);
  }, []), p = D(() => {
    m(), u(!1);
  }, [m]), g = D(() => {
    p(), a(""), o(!1), d.current = "", h.current = 0;
  }, [p]), y = D(() => {
    p(), a(d.current), o(!0), n == null || n();
  }, [p, n]), w = D(
    (k) => {
      m(), d.current = k, h.current = 0, a(""), o(!1), u(!0);
      const S = 1e3 / t;
      f.current = globalThis.setInterval(() => {
        h.current < d.current.length ? (h.current += 1, a(d.current.slice(0, h.current))) : (m(), u(!1), o(!0), n == null || n());
      }, S);
    },
    [t, n, m]
  );
  return H(() => () => m(), [m]), H(() => {
    s && d.current && w(d.current);
  }, [s, w]), {
    text: i,
    isComplete: r,
    isStreaming: c,
    start: w,
    stop: p,
    reset: g,
    skipToEnd: y
  };
}
function Eh(e) {
  const { phases: t, onAllComplete: n, autoStart: s = !1 } = e, [i, a] = $(-1), [r, o] = $(/* @__PURE__ */ new Set()), [c, u] = $(/* @__PURE__ */ new Set()), [d, h] = $(!1), f = B(null), m = D(() => {
    f.current && (globalThis.clearTimeout(f.current), f.current = null);
  }, []), p = i >= 0 && i < t.length ? t[i].id : null, g = D(
    (T) => r.has(T),
    [r]
  ), y = D(
    (T) => p === T,
    [p]
  ), w = D(
    (T) => c.has(T),
    [c]
  ), k = D(
    (T) => {
      if (T >= t.length) {
        h(!0), n == null || n();
        return;
      }
      const N = t[T], C = N.delay || 0;
      f.current = globalThis.setTimeout(() => {
        a(T), o((P) => /* @__PURE__ */ new Set([...P, N.id])), N.duration && (f.current = globalThis.setTimeout(() => {
          u((P) => /* @__PURE__ */ new Set([...P, N.id])), k(T + 1);
        }, N.duration));
      }, C);
    },
    [t, n]
  ), S = D(() => {
    m(), p && u((T) => /* @__PURE__ */ new Set([...T, p])), k(i + 1);
  }, [p, i, k, m]), v = D(() => {
    m(), a(-1), o(/* @__PURE__ */ new Set()), u(/* @__PURE__ */ new Set()), h(!1), k(0);
  }, [k, m]), x = D(() => {
    m(), a(-1), o(/* @__PURE__ */ new Set()), u(/* @__PURE__ */ new Set()), h(!1);
  }, [m]);
  return H(() => {
    s && v();
  }, [s, v]), H(() => () => m(), [m]), {
    currentPhase: p,
    currentIndex: i,
    showPhase: g,
    isPhaseActive: y,
    isPhaseComplete: w,
    completePhase: S,
    start: v,
    reset: x,
    isAllComplete: d
  };
}
function Bh(e = {}) {
  const {
    threshold: t = 50,
    behavior: n = "smooth",
    autoScrollOnChange: s = !0
  } = e, i = B(null), [a, r] = $(!0), [o, c] = $(!1), u = D(() => {
    const p = i.current;
    if (!p) return !0;
    const { scrollTop: g, scrollHeight: y, clientHeight: w } = p;
    return y - g - w <= t;
  }, [t]), d = D(() => {
    const p = i.current;
    return p ? p.scrollHeight > p.clientHeight : !1;
  }, []), h = D(
    (p) => {
      const g = i.current;
      g && g.scrollTo({
        top: g.scrollHeight,
        behavior: p != null && p.instant ? "instant" : n
      });
    },
    [n]
  ), f = D(
    (p) => {
      const g = i.current;
      g && g.scrollTo({
        top: 0,
        behavior: p != null && p.instant ? "instant" : n
      });
    },
    [n]
  ), m = D(
    (p, g) => {
      const y = i.current;
      if (!y) return;
      const w = y.getBoundingClientRect(), S = p.getBoundingClientRect().top - w.top + y.scrollTop;
      y.scrollTo({
        top: S,
        behavior: g != null && g.instant ? "instant" : n
      });
    },
    [n]
  );
  return H(() => {
    const p = i.current;
    if (!p) return;
    const g = () => {
      r(u()), c(d());
    };
    return p.addEventListener("scroll", g, { passive: !0 }), g(), () => {
      p.removeEventListener("scroll", g);
    };
  }, [u, d]), H(() => {
    const p = i.current;
    if (!p) return;
    const g = new ResizeObserver(() => {
      c(d()), s && a && h({ instant: !0 });
    });
    return g.observe(p), () => {
      g.disconnect();
    };
  }, [d, s, a, h]), H(() => {
    const p = i.current;
    if (!p || !s) return;
    const g = new MutationObserver(() => {
      c(d()), a && h();
    });
    return g.observe(p, {
      childList: !0,
      subtree: !0,
      characterData: !0
    }), () => {
      g.disconnect();
    };
  }, [s, a, h, d]), {
    scrollRef: i,
    isAtBottom: a,
    scrollToBottom: h,
    scrollToTop: f,
    scrollToElement: m,
    isScrollable: o
  };
}
function Au() {
  return Math.random().toString(36).substring(2, 11);
}
function Lu(e) {
  if (e === 0) return "0 Bytes";
  const t = 1024, n = ["Bytes", "KB", "MB", "GB"], s = Math.floor(Math.log(e) / Math.log(t));
  return parseFloat((e / Math.pow(t, s)).toFixed(2)) + " " + n[s];
}
function Ih(e = {}) {
  const {
    maxSize: t = 50 * 1024 * 1024,
    // 50MB default
    accept: n = [],
    maxFiles: s = 10,
    uploadFn: i,
    onFileAdded: a,
    onUploadComplete: r,
    onUploadError: o
  } = e, [c, u] = $([]), d = B(/* @__PURE__ */ new Set()), h = c.some((x) => x.status === "uploading"), f = c.length > 0 ? Math.round(c.reduce((x, T) => x + T.progress, 0) / c.length) : 0, m = D(
    (x) => {
      var T;
      if (x.size > t)
        return {
          valid: !1,
          error: `File too large. Maximum size is ${Lu(t)}`
        };
      if (n.length > 0) {
        const N = x.type, C = "." + ((T = x.name.split(".").pop()) == null ? void 0 : T.toLowerCase());
        if (!n.some((L) => {
          if (L.includes("*")) {
            const [E] = L.split("/");
            return N.startsWith(E + "/");
          }
          return L.startsWith(".") ? C === L.toLowerCase() : N === L;
        }))
          return {
            valid: !1,
            error: `File type not accepted. Allowed: ${n.join(", ")}`
          };
      }
      return { valid: !0 };
    },
    [t, n]
  ), p = D(
    (x) => {
      const T = [], N = Array.from(x), C = s - c.length, P = N.slice(0, C);
      for (const L of P) {
        const E = m(L), G = {
          id: Au(),
          file: L,
          name: L.name,
          size: L.size,
          type: L.type,
          progress: 0,
          status: E.valid ? "pending" : "error",
          error: E.error,
          previewUrl: L.type.startsWith("image/") ? URL.createObjectURL(L) : void 0
        };
        T.push(G), a == null || a(G);
      }
      u((L) => [...L, ...T]);
    },
    [c.length, s, m, a]
  ), g = D(
    (x, T) => {
      u(
        (N) => N.map((C) => C.id === x ? { ...C, ...T } : C)
      );
    },
    []
  ), y = D(
    async (x) => {
      const T = c.find((N) => N.id === x);
      if (!(!T || T.status !== "pending" || d.current.has(x))) {
        d.current.add(x), g(x, { status: "uploading", progress: 0 });
        try {
          if (i) {
            const N = await i(T.file, (P) => {
              g(x, { progress: P });
            });
            g(x, {
              status: "complete",
              progress: 100,
              response: N
            });
            const C = { ...T, status: "complete", progress: 100, response: N };
            r == null || r(C);
          } else {
            for (let N = 0; N <= 100; N += 10)
              await new Promise((C) => setTimeout(C, 100)), g(x, { progress: N });
            g(x, { status: "complete", progress: 100 }), r == null || r({ ...T, status: "complete", progress: 100 });
          }
        } catch (N) {
          const C = N instanceof Error ? N.message : "Upload failed";
          g(x, { status: "error", error: C }), o == null || o({ ...T, status: "error", error: C }, N);
        } finally {
          d.current.delete(x);
        }
      }
    },
    [c, i, g, r, o]
  ), w = D(async () => {
    const x = c.filter((T) => T.status === "pending");
    await Promise.all(x.map((T) => y(T.id)));
  }, [c, y]), k = D((x) => {
    u((T) => {
      const N = T.find((C) => C.id === x);
      return N != null && N.previewUrl && URL.revokeObjectURL(N.previewUrl), T.filter((C) => C.id !== x);
    });
  }, []), S = D(() => {
    c.forEach((x) => {
      x.previewUrl && URL.revokeObjectURL(x.previewUrl);
    }), u([]);
  }, [c]), v = D(() => {
    S(), d.current.clear();
  }, [S]);
  return {
    files: c,
    isUploading: h,
    overallProgress: f,
    addFiles: p,
    uploadFile: y,
    uploadAll: w,
    removeFile: k,
    clearFiles: S,
    reset: v,
    validateFile: m
  };
}
function jh(e) {
  const { steps: t, initialData: n = {}, onComplete: s, onStepChange: i } = e, [a, r] = $(0), [o, c] = $(n), [u, d] = $({}), [h, f] = $(!1), [m, p] = $(/* @__PURE__ */ new Set([0])), [g, y] = $(/* @__PURE__ */ new Set()), w = t[a], k = t.length, S = a === 0, v = a === k - 1, x = ne(() => {
    const V = t[a];
    return V.fields ? V.fields.every((R) => o[R] !== void 0 && o[R] !== "") : !0;
  }, [a, o, t]), T = D(async () => {
    const V = t[a];
    if (!V.validate)
      return !0;
    try {
      const R = await V.validate(o);
      if (R === !0)
        return d((z) => {
          const Ne = { ...z };
          return delete Ne[V.id], Ne;
        }), !0;
      const j = typeof R == "string" ? R : "Validation failed";
      return d((z) => ({ ...z, [V.id]: j })), !1;
    } catch (R) {
      const j = R instanceof Error ? R.message : "Validation error";
      return d((z) => ({ ...z, [V.id]: j })), !1;
    }
  }, [a, o, t]), N = D(async () => {
    let V = !0;
    const R = {};
    for (const j of t)
      if (j.validate)
        try {
          const z = await j.validate(o);
          z !== !0 && (V = !1, R[j.id] = typeof z == "string" ? z : "Validation failed");
        } catch (z) {
          V = !1, R[j.id] = z instanceof Error ? z.message : "Validation error";
        }
    return d(R), V;
  }, [o, t]), C = D(async () => {
    if (!await T() && !t[a].optional)
      return !1;
    if (a < k - 1) {
      y((j) => /* @__PURE__ */ new Set([...j, a]));
      const R = a + 1;
      return r(R), p((j) => /* @__PURE__ */ new Set([...j, R])), i == null || i(R, t[R]), !0;
    }
    return !1;
  }, [a, k, T, t, i]), P = D(() => {
    if (a > 0) {
      const V = a - 1;
      r(V), i == null || i(V, t[V]);
    }
  }, [a, t, i]), L = D(
    (V) => {
      V >= 0 && V < k && m.has(V) && (r(V), i == null || i(V, t[V]));
    },
    [k, m, t, i]
  ), E = D((V) => {
    c((R) => ({ ...R, ...V }));
  }, []), G = D((V, R) => {
    c((j) => ({ ...j, [V]: R }));
  }, []), se = D(async () => {
    if (await N()) {
      f(!0);
      try {
        await (s == null ? void 0 : s(o)), y((R) => /* @__PURE__ */ new Set([...R, a]));
      } finally {
        f(!1);
      }
    }
  }, [N, s, o, a]), _ = D(() => {
    r(0), c(n), d({}), f(!1), p(/* @__PURE__ */ new Set([0])), y(/* @__PURE__ */ new Set());
  }, [n]), Be = D(
    (V) => {
      var R;
      return u[(R = t[V]) == null ? void 0 : R.id] ? "error" : V === a ? "active" : g.has(V) ? "complete" : "pending";
    },
    [a, g, u, t]
  ), Qe = D(
    (V) => m.has(V),
    [m]
  );
  return {
    currentStep: a,
    currentStepConfig: w,
    totalSteps: k,
    isFirstStep: S,
    isLastStep: v,
    data: o,
    errors: u,
    isSubmitting: h,
    isStepValid: x,
    next: C,
    prev: P,
    goToStep: L,
    updateData: E,
    setField: G,
    validateStep: T,
    validateAll: N,
    submit: se,
    reset: _,
    getStepStatus: Be,
    canAccessStep: Qe
  };
}
export {
  ih as ArtifactContainer,
  Ku as AssistantMessage,
  Ju as AttachmentChip,
  _d as Avatar,
  Vh as CardSkeleton,
  th as ChainOfThought,
  dh as ChartContainer,
  Hu as ChatContainer,
  Xu as ChatInput,
  Sh as ChatLanding,
  rh as CodeBlock,
  oh as DataCard,
  ah as DataTable,
  ch as DocumentViewer,
  mh as EditableField,
  wh as ErrorState,
  Zu as FileUpload,
  Mh as FloatingPanel,
  Ph as FooterActions,
  au as FormStep,
  lh as ImageViewer,
  uh as InlineForm,
  Nt as Logo,
  zu as Markdown,
  Yu as MessageGroup,
  Uu as MessageList,
  Lh as MessageSkeleton,
  xh as Milestones,
  bh as PendingState,
  sh as ProcessingSteps,
  yh as ProgressBar,
  gh as ProgressRing,
  Nh as RateLimitError,
  fh as SelectableOptions,
  qu as SendButton,
  Wu as SmartText,
  Ch as SplitView,
  ph as Stepper,
  Ou as StreamingText,
  vh as SuccessState,
  Ah as SuggestionPills,
  kh as SupportWidget,
  Gu as SystemMessage,
  Dh as TableSkeleton,
  $h as TextSkeleton,
  eh as ThinkingIndicator,
  nh as ToolExecution,
  Th as UserFeedback,
  _u as UserMessage,
  Qu as VoiceInput,
  hh as WizardForm,
  Bu as blurIn,
  Id as fadeIn,
  Fu as pulsingDot,
  jd as rotatingLogo,
  Iu as scaleIn,
  Eu as slideDown,
  Ru as slideUp,
  ju as springConfig,
  Ee as staggerContainer,
  Bh as useAutoScroll,
  Ih as useFileUpload,
  jh as useFormWizard,
  Eh as useStreamPhases,
  Rh as useStreamingText
};
//# sourceMappingURL=index.js.map
