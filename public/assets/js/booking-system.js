$(document).ready(function () {
    var navListItems = $('.setup-panel a'),
        allWells = $('.step-content'),
        allNextBtn = $('.nextBtn');
    allWells.hide();
    navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
            $item = $(this);
        if (!$item.hasClass('disabled')) {
            navListItems.removeClass('btn-success').addClass('btn-default');
            $item.addClass('btn-success');
            allWells.hide();
            $target.show();

            // 🚫 datepicker input'una focus VERME — sadece diğer inputlara ver
            $target.find('input:not(.datepicker):first').focus();
        }
    });
    allNextBtn.click(function () {
        var curStep = $(this).closest(".step-content"),
            curStepId = curStep.attr("id"),
            nextStepWizard = $('.setup-panel a[href="#' + curStepId + '"]').parent().next().children("a"),
            curInputs = curStep.find("input[type='text'], input[type='email'], input[type='password']"),
            isValid = true;
        curInputs.each(function () {
            if (!this.checkValidity()) {
                isValid = false;
                $(this).closest(".form-group").addClass("has-error");
            } else {
                $(this).closest(".form-group").removeClass("has-error");
            }
        });
        if (isValid) {
            nextStepWizard.removeClass('disabled').trigger('click');
        }
    });
    $('.setup-panel a.btn-success').trigger('click');
});
