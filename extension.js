/*
 * Copyright (c) 2018 Anthony DeDominic <adedomin@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Extension that allows for using "alt tab" with sloppy mouse focus.

const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const AltTab = imports.ui.altTab;

// Monkey patching gnome-shell. lol
let OverrideFinish = AltTab.WindowSwitcherPopup.prototype._finish;

function init() {
}

function enable() {
  AltTab.WindowSwitcherPopup.prototype._finish = function() {
    let currWindow = this._items[this._selectedIndex].window;
    let lastWindow = this._items[this._previous()].window;
    let nextWindow = this._items[this._next()].window;
    // forward alt tab
    let focusHandle1 = lastWindow.connect("focus", () => {
      lastWindow.disconnect(focusHandle1);
      Main.activateWindow(currWindow);
    });
    // backward alt tab
    let focusHandle2 = nextWindow.connect("focus", () => {
      nextWindow.disconnect(focusHandle2);
      Main.activateWindow(currWindow);
    })
    /*
     * If the User:
     *  a) Never had the mouse over any window
     *  b) The user had the mouse over the window to be
     *     Alt+Tab'd into
     *  c) The alt+tab action wasn't the forward or backward
     *     action.
     * This cleans up all the listeners after ~100ms
     */
    Mainloop.timeout_add(100, () => {
      lastWindow.disconnect(focusHandle1);
      nextWindow.disconnect(focusHandle2);
    });
    OverrideFinish.call(this);
    /*
     * Alternative to the signal way.
     */
    //Mainloop.timeout_add(50, () => {
    //  Main.activateWindow(currWindow);
    //});
  };
}

function disable() {
  AltTab.WindowSwitcherPopup.prototype._finish = OverrideFinish;
}
