SRC_DIR = src
JS_DIR = js
BUILD_DIR = build

JS = $(wildcard $(SRC_DIR)/$(JS_DIR)/*.js)
JS_BUILD = $(JS:$(SRC_DIR)/$(JS_DIR)/%.js=$(BUILD_DIR)/$(JS_DIR)/%.js)
HTML = $(wildcard $(SRC_DIR)/*.html)
HTML_BUILD = $(HTML:$(SRC_DIR)/%.html=$(BUILD_DIR)/%.html)

.PHONY: all
all: dir js html

dir:
	mkdir -p $(BUILD_DIR)/$(JS_DIR)

js: $(JS_BUILD)
$(BUILD_DIR)/$(JS_DIR)/%.js: $(SRC_DIR)/$(JS_DIR)/%.js
	babel $< -o $@

html: $(HTML_BUILD)
$(BUILD_DIR)/%.html: $(SRC_DIR)/%.html
	cp -f $< $@
