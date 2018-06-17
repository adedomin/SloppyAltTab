OBJ := extension.js \
       metadata.json

INSTALLDIR := \
    $(HOME)/.local/share/gnome-shell/extensions/SloppyAltTab@anthony.dedominic.pw

$(INSTALLDIR)/%: % | $(OBJ)
	install -D $< $@

install: $(addprefix $(INSTALLDIR)/,$(OBJ))
