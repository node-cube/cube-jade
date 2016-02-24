install:
	@npm install .

publish-runtime:
	@cd ./runtime && npm publish

publish: publish-runtime
	@npm publish

test:
	@npm test

.PHONY: \
	install publish publish-runtime test
